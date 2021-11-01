import React, { useEffect, useRef, useState, useCallback } from 'react';
import Quagga from 'quagga';

const App = (props) => {

  const firstUpdate = useRef(true);
  const [isStart, setIsStart] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [useImage, setUseImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [barcodeResult, setBarcodeResult] = useState(null);

  const stopScanner = useCallback(() => {
    Quagga.offProcessed();
    Quagga.offDetected();
    Quagga.stop();
  }, []);
  
  
  const startScanner = useCallback(() => {
    const _onDetected = res => {
      stopScanner();
      setBarcode(res.codeResult.code);
    };

    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          target: document.querySelector('#scanner-container'),
          constraints: {
            facingMode: 'user' // or user
          }
        },
        numOfWorkers: navigator.hardwareConcurrency,
        locate: true,
        frequency: 1,
        debug: {
          drawBoundingBox: true,
          showFrequency: true,
          drawScanline: true,
          showPattern: true
        },
        multiple: false,
        locator: {
          halfSample: false,
          patchSize: 'small', // x-small, small, medium, large, x-large
          debug: {
            showCanvas: false,
            showPatches: false,
            showFoundPatches: false,
            showSkeleton: false,
            showLabels: false,
            showPatchLabels: false,
            showRemainingPatchLabels: false,
            boxFromPatches: {
              showTransformed: false,
              showTransformedBox: false,
              showBB: false
            }
          }
        },
        decoder: {
          readers: ["code-128_reader", "ean_reader"]
        }
      },
      err => {
        if (err) {
          return console.log(err);
        }
        Quagga.start();
      }
    );
    Quagga.onDetected(_onDetected);
    Quagga.onProcessed(result => {
      let drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute('width')),
            parseInt(drawingCanvas.getAttribute('height'))
          );
          result.boxes.filter(box => box !== result.box).forEach(box => {
            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
              color: 'green',
              lineWidth: 2
            });
          });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
        }
      }
    });
  }, [stopScanner]);

  const scanImage = useCallback((image) => {
    Quagga.decodeSingle({
      decoder: {
        readers: ["ean_reader"]
      },
      locate: true, // try to locate the barcode in the image
      src: image // or 'data:image/jpg;base64,' + data
  }, function(result){
      if(result.codeResult) {
        setBarcodeResult(result.codeResult.code)
      } else {
        setBarcodeResult("not detected")  
      }
  });
  }, [])

  useEffect(() => {
    return () => {
      if (isStart) stopScanner();
    };
  });

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (isStart) startScanner();
    else stopScanner();
  }, [isStart, startScanner, stopScanner]);

  useEffect(() => {
    if (selectedImage != null) {
      setImageUrl(URL.createObjectURL(selectedImage))
    }
  }, [selectedImage])

  useEffect(() => {
    if (imageUrl != null) {
      scanImage(imageUrl)
    }
  }, [imageUrl, scanImage])

  return <div className="container">
    <button onClick={() => setUseImage(true)}>
      Upload an image
    </button>

    <button onClick={() => {setIsStart(false); setUseImage(false); }}>
      Scan from camera
    </button>
    
    <br />

    { !useImage && <button onClick={() => setIsStart(prevStart => !prevStart)} style={{ marginBottom: 20 }}>{isStart ? 'Stop' : 'Start'}</button>}
    {isStart && !useImage && <div>
      <div id="scanner-container" />
      
      <span>Barcode: {barcode}</span>
    </div>}

    { useImage && <div>
      {selectedImage && (
        <div>
        <img alt="not fount" width={"250px"} src={imageUrl} />
        <br />
        <button onClick={()=>setSelectedImage(null)}>Remove</button>
        </div>
      )}
      <br />
     
      <br /> 
      <input
        type="file"
        name="myImage"
        onChange={(event) => setSelectedImage(event.target.files[0])}
      />
      <h1> Result: {barcodeResult} </h1>
    </div>}
  </div>
}

export default App;