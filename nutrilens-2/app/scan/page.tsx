"use client";

import { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Camera, X, RefreshCw, Info } from "lucide-react";

type ProductNutriments = {
  energy?: number;
  proteins?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugars?: number;
  salt?: number;
};

type ProductData = {
  product: {
    product_name: string;
    brands?: string;
    serving_size?: string;
    nutriments?: ProductNutriments;
    nutrients?: {
      "vitamin-a"?: string;
      "vitamin-c"?: string;
      calcium?: string;
      iron?: string;
    };
    ingredients_text?: string;
    allergens?: string;
    image_url?: string;
    nova_group?: number;
    ecoscore_grade?: string;
  };
};

type RecentScan = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  image?: string;
  date: number;
};

export default function BarcodeScanner() {
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [servingMultiplier, setServingMultiplier] = useState([1]);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = new BrowserMultiFormatReader();

  // Load recent scans from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedScans = localStorage.getItem("recentScans");
      if (savedScans) {
        try {
          const parsedScans = JSON.parse(savedScans);
          const sortedScans = parsedScans
            .sort((a: RecentScan, b: RecentScan) => b.date - a.date)
            .slice(0, 10);
          setRecentScans(sortedScans);
        } catch (e) {
          console.error("Failed to parse recent scans", e);
        }
      }
    }
  }, []);

  // Save recent scans to localStorage
  useEffect(() => {
    if (recentScans.length > 0) {
      localStorage.setItem("recentScans", JSON.stringify(recentScans));
    }
  }, [recentScans]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      codeReader.reset();
    };
  }, []);

  const fetchProductData = async (barcode: string) => {
    try {
      setScanning(true);
      setError(null);

      const response = await axios.get(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );

      if (response.data.status === 0) {
        throw new Error("Product not found in database");
      }

      const data = response.data as ProductData;
      setProductData(data);

      if (data.product?.product_name) {
        const newScan: RecentScan = {
          id: barcode,
          name: data.product.product_name,
          calories: data.product.nutriments?.energy
            ? Math.round(data.product.nutriments.energy / 4.184)
            : 0,
          protein: data.product.nutriments?.proteins || 0,
          image: data.product.image_url,
          date: Date.now(),
        };

        setRecentScans((prev) => {
          const existingIndex = prev.findIndex((scan) => scan.id === barcode);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = newScan;
            return updated;
          }
          return [newScan, ...prev.slice(0, 9)];
        });
      }

      setScanComplete(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch product data"
      );
      setScanComplete(false);
    } finally {
      setScanning(false);
    }
  };

  const startCameraScan = async () => {
    setCameraOpen(true);
    setError(null);
    setCameraError(null);

    try {
      const devices = await codeReader.listVideoInputDevices();

      if (devices.length === 0) {
        throw new Error("No camera devices found");
      }

      const deviceId = devices[0].deviceId;

      if (videoRef.current) {
        setIsScanningActive(true);
        codeReader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              setIsScanningActive(false);
              handleBarcodeDetected(result.getText());
            }
            if (err) {
              if (!(err instanceof DOMException)) {
                if (!(err instanceof NotFoundException)) {
                  setCameraError(
                    "Barcode scanning failed. Try adjusting the camera position."
                  );
                }
              }
            }
          }
        );
      }
    } catch (err) {
      setIsScanningActive(false);
      if (err instanceof Error) {
        if (err.message.includes("Permission denied")) {
          setCameraError(
            "Camera access was denied. Please enable camera permissions."
          );
        } else if (err.message.includes("No camera devices found")) {
          setCameraError("No camera found. Please check your device.");
        } else {
          setCameraError("Failed to initialize camera. Please try again.");
        }
      }
    }
  };

  const stopCameraScan = () => {
    try {
      codeReader.reset();
      setIsScanningActive(false);
    } catch (err) {
      console.error("Error stopping scanner:", err);
    }
    setCameraOpen(false);
  };

  const handleBarcodeDetected = (barcode: string) => {
    stopCameraScan();
    fetchProductData(barcode);
  };

  const retryScanning = () => {
    stopCameraScan();
    setTimeout(startCameraScan, 500);
  };

  const resetScan = () => {
    setScanComplete(false);
    setProductData(null);
  };

  const handleServingChange = (value: number[]) => {
    setServingMultiplier(value);
  };

  const formatNutrient = (value?: number, unit?: string) => {
    if (value === undefined || isNaN(value)) return "N/A";
    const multipliedValue = value * servingMultiplier[0];
    return `${Math.round(multipliedValue * 10) / 10}${unit || ""}`;
  };

  const parseAllergens = (allergensString?: string) => {
    if (!allergensString) return [];
    return allergensString
      .split(",")
      .map((a) => a.replace("en:", "").trim())
      .filter((a) => a.length > 0);
  };

  const getNutritionScoreColor = (grade?: string) => {
    if (!grade) return "default";
    const gradeLower = grade.toLowerCase();
    if (gradeLower === "a") return "bg-green-500";
    if (gradeLower === "b") return "bg-blue-500";
    if (gradeLower === "c") return "bg-yellow-500";
    if (gradeLower === "d" || gradeLower === "e") return "bg-red-500";
    return "bg-gray-500";
  };

  const getNovaGroupInfo = (group?: number) => {
    if (!group) return null;
    
    const novaColors = {
      1: "bg-green-500",
      2: "bg-blue-500",
      3: "bg-yellow-500",
      4: "bg-red-500"
    };
    
    return (
      <div className="flex items-center mt-2">
        <span className="text-sm mr-2">Processing level:</span>
        <Badge className={`${novaColors[group as keyof typeof novaColors] || 'bg-gray-500'} text-white`}>
          NOVA {group}
        </Badge>
        <Info className="w-4 h-4 ml-1" />
      </div>
    );
  };

  return (
    <div className="max-w-sm mx-auto pb-8 bg-gray-50 min-h-screen relative">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white p-4 text-center border-b">
        <h2 className="text-xl font-semibold">Nutrition Scanner</h2>
      </div>

      {/* Error Dialog */}
      <Dialog open={!!error} onOpenChange={() => setError(null)}>
        <DialogContent>
          <p>{error}</p>
        </DialogContent>
      </Dialog>

      {/* Camera Dialog */}
      <Dialog open={cameraOpen} onOpenChange={stopCameraScan}>
        <DialogContent className="p-0 absolute min-h-[300px] flex flex-col justify-center bg-black">
          <video
            ref={videoRef}
            className={`w-full h-auto ${cameraError ? 'hidden' : 'block'}`}
          />

          {cameraError && (
            <div className="flex flex-col items-center justify-center p-4 text-center flex-1">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Scanning Error</h3>
              <p className="mb-6 text-white">{cameraError}</p>
              <Button variant="default" onClick={retryScanning}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          )}

          <div className="absolute top-4 right-4 bg-black/50 rounded-full">
            <Button variant="ghost" size="icon" onClick={stopCameraScan} className="text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {!cameraError && (
            <>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70%] h-[30%] border-4 border-white/70 rounded-md" />

              <div className="absolute bottom-5 left-0 right-0 text-center">
                <span className="text-white bg-black/50 px-2 py-1 rounded-md">
                  {isScanningActive ? "Scanning..." : "Point camera at barcode"}
                </span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {!scanComplete ? (
        // Scanner View
        <div>
          {/* Scanner Area */}
          <div className="flex flex-col items-center justify-center py-8 bg-white mb-2">
            <div className="w-48 h-48 rounded-full border-2 border-blue-100 flex items-center justify-center relative mb-4">
              <div className="w-40 h-40 rounded-full border-2 border-blue-200 flex items-center justify-center">
                {scanning ? (
                  <div className="w-12 h-12 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="text-blue-300 text-5xl">
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3,3 L8,3 L8,8 L3,8 L3,3 Z M10,3 L14,3 L14,8 L10,8 L10,3 Z M16,3 L21,3 L21,8 L16,8 L16,3 Z M3,10 L8,10 L8,14 L3,14 L3,10 Z M3,16 L8,16 L8,21 L3,21 L3,16 Z M10,16 L14,16 L14,21 L10,21 L10,16 Z M16,16 L21,16 L21,21 L16,21 L16,16 Z M16,10 L18,10 L18,14 L16,14 L16,10 Z M19,10 L21,10 L21,14 L19,14 L19,10 Z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-6">Position barcode here</p>
            <Button
              onClick={startCameraScan}
              disabled={scanning}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 w-[90%]"
            >
              <Camera className="mr-2 h-4 w-4" />
              {scanning ? "Scanning..." : "Scan Barcode"}
            </Button>

            {/* Demo button */}
            <Button
              variant="outline"
              onClick={() => fetchProductData("7622210449283")}
              disabled={scanning}
              className="mt-4 rounded-full px-6 py-3 w-[90%]"
            >
              Demo Scan (Oreo)
            </Button>
          </div>

          {/* Recent Scans */}
          {recentScans.length > 0 && (
            <Card className="p-4 mb-2">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg font-semibold">Recent Scans</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-2 gap-4">
                  {recentScans.map((scan) => (
                    <Card
                      key={scan.id}
                      className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => fetchProductData(scan.id)}
                    >
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarImage src={scan.image} />
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-medium truncate">{scan.name}</h4>
                          <p className="text-xs text-gray-500">
                            {scan.calories} cal • {scan.protein}g protein
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips Section */}
          <Card className="p-4 mb-2">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-lg font-semibold">Scanning Tips</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="list-disc pl-5 space-y-1">
                <li className="text-sm">Ensure good lighting</li>
                <li className="text-sm">Hold steady about 6 inches away</li>
                <li className="text-sm">Center the barcode in the frame</li>
                <li className="text-sm">Clean your camera lens if blurry</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Scan Result View
        <div>
          {/* Camera Button */}
          <div className="flex flex-col items-center justify-center py-8 bg-white mb-2">
            <Button
              variant="outline"
              size="icon"
              className="w-20 h-20 mb-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={resetScan}
            >
              <Camera className="h-8 w-8" />
            </Button>
            <p className="text-sm text-gray-500">Tap to Scan Again</p>
          </div>

          {/* Product Information */}
          {productData?.product && (
            <Card className="mb-2">
              <CardContent className="p-6">
                {/* Product Name and Image */}
                <div className="flex gap-4 mb-6">
                  {productData.product.image_url && (
                    <Avatar className="w-20 h-20 flex-shrink-0">
                      <AvatarImage src={productData.product.image_url} />
                    </Avatar>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">
                      {productData.product.product_name || "Unknown Product"}
                    </h2>
                    {productData.product.brands && (
                      <p className="text-sm text-gray-500">
                        {productData.product.brands}
                      </p>
                    )}

                    {/* Nutrition Score */}
                    {productData.product.ecoscore_grade && (
                      <div className="mt-2">
                        <Badge className={`${getNutritionScoreColor(productData.product.ecoscore_grade)} text-white`}>
                          Eco-Score: {productData.product.ecoscore_grade.toUpperCase()}
                        </Badge>
                      </div>
                    )}

                    {/* Nova Group */}
                    {getNovaGroupInfo(productData.product.nova_group)}
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Serving Size: {productData.product.serving_size || "100g"}
                </p>

                {/* Calories */}
                <h1 className="text-4xl font-bold mb-4">
                  {productData.product.nutriments?.energy
                    ? Math.round(
                        (productData.product.nutriments.energy / 4.184) *
                          servingMultiplier[0]
                      )
                    : "N/A"}
                  <span className="text-sm text-gray-500 ml-1">calories</span>
                </h1>

                {/* Macros */}
                <div className="mb-8">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Progress
                        value={
                          productData.product.nutriments?.proteins
                            ? Math.min(
                                (productData.product.nutriments.proteins / 50) *
                                  100,
                                100
                              )
                            : 0
                        }
                        className="h-2 mb-2 bg-gray-100"
                      />
                      <h3 className="text-xl font-bold">
                        {formatNutrient(
                          productData.product.nutriments?.proteins,
                          "g"
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">Protein</p>
                    </div>
                    <div>
                      <Progress
                        value={
                          productData.product.nutriments?.carbohydrates
                            ? Math.min(
                                (productData.product.nutriments.carbohydrates /
                                  100) *
                                  100,
                                100
                              )
                            : 0
                        }
                        className="h-2 mb-2 bg-gray-100"
                      />
                      <h3 className="text-xl font-bold">
                        {formatNutrient(
                          productData.product.nutriments?.carbohydrates,
                          "g"
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">Carbs</p>
                    </div>
                    <div>
                      <Progress
                        value={
                          productData.product.nutriments?.fat
                            ? Math.min(
                                (productData.product.nutriments.fat / 50) * 100,
                                100
                              )
                            : 0
                        }
                        className="h-2 mb-2 bg-gray-100"
                      />
                      <h3 className="text-xl font-bold">
                        {formatNutrient(
                          productData.product.nutriments?.fat,
                          "g"
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">Fat</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Nutrition */}
                <div className="mb-8">
                  <h3 className="text-xl mb-4">Detailed Nutrition</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <p className="text-sm">Fiber</p>
                      <p className="text-sm text-gray-500">
                        {formatNutrient(
                          productData.product.nutriments?.fiber,
                          "g"
                        )}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Sugars</p>
                      <p className="text-sm text-gray-500">
                        {formatNutrient(
                          productData.product.nutriments?.sugars,
                          "g"
                        )}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Salt</p>
                      <p className="text-sm text-gray-500">
                        {formatNutrient(
                          productData.product.nutriments?.salt,
                          "g"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vitamins & Minerals */}
                <h3 className="text-xl mb-4">Vitamins & Minerals</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex justify-between">
                    <p className="text-sm">Vitamin A</p>
                    <p className="text-sm text-gray-500">
                      {productData.product.nutrients?.["vitamin-a"] || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Vitamin C</p>
                    <p className="text-sm text-gray-500">
                      {productData.product.nutrients?.["vitamin-c"] || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Calcium</p>
                    <p className="text-sm text-gray-500">
                      {productData.product.nutrients?.calcium || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Iron</p>
                    <p className="text-sm text-gray-500">
                      {productData.product.nutrients?.iron || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Ingredients */}
                {productData.product.ingredients_text && (
                  <>
                    <h3 className="text-xl mb-2">Ingredients</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      {productData.product.ingredients_text}
                    </p>
                  </>
                )}

                {/* Allergens */}
                {productData.product.allergens && (
                  <>
                    <h3 className="text-xl mb-2">Allergens</h3>
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Warning</AlertTitle>
                      <AlertDescription>
                        Contains {parseAllergens(productData.product.allergens).join(", ")}
                      </AlertDescription>
                    </Alert>
                  </>
                )}

                {/* Adjust Serving */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-xl">Adjust Serving</h3>
                    <p className="text-sm">{servingMultiplier[0]}x</p>
                  </div>
                  <Slider
                    value={servingMultiplier}
                    onValueChange={handleServingChange}
                    min={0.5}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}