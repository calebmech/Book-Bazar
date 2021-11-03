import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import Quagga from "quagga";

interface Props {

}
interface State {
  wizardStep: number,
  isbnEntryMethod: IsbnEntryMethod,
  isbn?: string,
  bookInfo?: BookInfo
}
interface BookInfo {
  title: string,
  author: string,
  edition: string
}

export default class CreatePostingWizard extends React.Component<Props, State> {

  private static BOOK_INFO: BookInfo = {
    author: "You and I",
    edition: "3rd",
    title: "Us"
  }

  private nextStep: () => void = () => {
    this.setState((state: State) => {
      return {
        wizardStep: state.wizardStep + 1
      }
    });
  };

  private lastStep: () => void = () => {
    this.setState((state: State) => {
      return {
        wizardStep: state.wizardStep - 1
      }
    });
  };

  private restart: () => void = () => {
    this.setState((_state: State) => {
      return {
        wizardStep: 0,
        bookInfo: null,
      }
    });
  }

  private setISBN: (isbn: string) => void = (isbn: string) => {
    this.setState((_state: State) => {
      return {
        isbn: isbn,
      };
    });
  };

  private setIsbnEntryMethod: (isbnEntryMethod: IsbnEntryMethod) => void = (isbnEntryMethod) => {
    this.setState((_state: State) => {
      return {
        isbnEntryMethod: isbnEntryMethod
      };
    });
  };

  getBookInfoFromISBN: () => Promise<void> = async () => {
    const bookInfo = await (async (isbn: string): Promise<BookInfo> => {
      return CreatePostingWizard.BOOK_INFO;
    })(this.state.isbn);
    this.setState((_state: State) => {
      return {
        bookInfo: bookInfo
      };
    });
    await new Promise<void>((resolve, reject) => {
      let wait = setTimeout(() => {
        clearTimeout(wait);
        resolve();
      }, 2000);
    })
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      wizardStep: 0,
      isbnEntryMethod: IsbnEntryMethod.Image,
      bookInfo: null,
    };
  }

  render() {
    switch (this.state.wizardStep) {
      case 0:
        return <SelectIsbnEntryMethod nextStep={this.nextStep} setIsbnEntryMethod={this.setIsbnEntryMethod} />;
      case 1:
        if (this.state.isbnEntryMethod == IsbnEntryMethod.Image) {
          return <ImageScanner nextStep={this.nextStep} lastStep={this.lastStep} setISBN={this.setISBN} />;
        } else if (this.state.isbnEntryMethod == IsbnEntryMethod.Video) {
          return <VideoScanner nextStep={this.nextStep} lastStep={this.lastStep} setISBN={this.setISBN} />;
        } else {
          return <ISBNEntry nextStep={this.nextStep} setISBN={this.setISBN} />;
        }
      case 2:
        return <FindingBook bookInfoPromise={this.getBookInfoFromISBN} nextStep={this.nextStep} />;
      case 3:
        return <IsThisYourBook isbn={this.state.isbn} nextStep={this.nextStep} bookInfo={CreatePostingWizard.BOOK_INFO} restart={this.restart} />
      case 4:
        return <PriceAndPhotoInput isbn={this.state.isbn} bookInfo={CreatePostingWizard.BOOK_INFO} nextStep={this.nextStep} />;
      case 5:
        return <Congrats />;
      default:
        return badWizardState();
    }
  }
}

// ---
enum IsbnEntryMethod {
  Image,
  Video,
  Typed
}
interface SelectIsbnEntryMethodProps {
  nextStep: () => void,
  setIsbnEntryMethod: (isbnEntryMethod: IsbnEntryMethod) => void
}

class SelectIsbnEntryMethod extends React.Component<SelectIsbnEntryMethodProps> {

  private scanBarcodeImageClicked: () => void;
  private scanBarcodeVideoClicked: () => void;
  private typeISBNClicked: () => void;

  constructor(props: SelectIsbnEntryMethodProps) {
    super(props);
    this.scanBarcodeImageClicked = () => {
      props.setIsbnEntryMethod(IsbnEntryMethod.Image);
      props.nextStep();
    };
    this.scanBarcodeVideoClicked = () => {
      props.setIsbnEntryMethod(IsbnEntryMethod.Video);
      props.nextStep();
    };
    this.typeISBNClicked = () => {
      props.setIsbnEntryMethod(IsbnEntryMethod.Typed);
      props.nextStep();
    };
  }

  render() {
    return (
      <div>
        <p>The first step to making a book posting is getting the book information. You can either scan the barcode with your camera or type in the ISBN. We will handle getting the title, author, and edition for you.</p>
        <div>
          <button onClick={this.scanBarcodeImageClicked}>Scan Barcode From An Image File</button>
          <span>&nbsp;&nbsp;&nbsp;</span>
          <button onClick={this.scanBarcodeVideoClicked}>Scan Barcode From Your Camera Feed</button>
          <span>&nbsp;&nbsp;&nbsp;</span>
          <button onClick={this.typeISBNClicked}>Type in ISBN</button>
        </div>
      </div>
    )
  }

}

// ---

const ImageScanner = (props: any) => {
  const { setISBN } = props;
  const { nextStep } = props;
  const { lastStep } = props;

  const [selectedImage, setSelectedImage] = useState<File>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(null);
  const [barcode, setBarcode] = useState<string>(null);

  const updateBarcode = (result) => {
      if(result.codeResult) {
          setISBN(result.codeResult.code)
          setBarcode(result.codeResult.code)
      } 
      else {
          setBarcode("Not detected")
      }
  }
  
  const scanImage = useCallback((image) => {
      Quagga.decodeSingle({
        decoder: {
            readers: ["ean_reader"]
        },
        locate: true, // try to locate the barcode in the image
        src: image // or 'data:image/jpg;base64,' + data
    }, updateBarcode);
  }, []);

  useEffect(() => {
    if (selectedImageUrl != null) {
      scanImage(selectedImageUrl);
    }
  }, [selectedImageUrl, scanImage])

  useEffect(() => {
      if (selectedImage != null) {
        setSelectedImageUrl(URL.createObjectURL(selectedImage));
      }
  }, [selectedImage]);

  return (
      <div>
          <input
              type="file"
              name="myImage"
              onChange={(event) => setSelectedImage(event.target.files[0])}
          />

          {selectedImage && <div>
              <img alt="not fount" width={"250px"} src={selectedImageUrl} />
              <button onClick={() => setSelectedImage(null)}>Remove</button>
              <h1> Detected Barcode: {barcode} </h1>
          </div>}

          <br />

          <button onClick={lastStep}> Back </button>
          {barcode != null && barcode != "Not detected" && <button onClick={nextStep}> Next </button>}
      </div>
  )
}

const VideoScanner = props => {
  const { setISBN } = props;
  const { nextStep } = props;
  const { lastStep } = props;

  const updateBarcode = (result) => {
    if(result.codeResult) {
        Quagga.stop();
        setISBN(result.codeResult.code)
        nextStep();
    } 
  }
  
  useEffect(() => {
    Quagga.init({
        "inputStream": {
          "type": "LiveStream",
          target: document.querySelector('#scanner-container')
        },
        "locator": {
          "patchSize": "medium",
          "halfSample": true
        },
        "numOfWorkers": 2,
        "frequency": 10,
        "decoder": {
          "readers": ["ean_reader"]
        },
        "locate": true
      }, err => {
      if (err) {
        console.log(err, "error msg");
      }
      Quagga.start();
      return () => {
        Quagga.stop()
      }
    });

    //detecting boxes on stream
    Quagga.onProcessed(result => {
      var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            Number(drawingCanvas.getAttribute("width")),
            Number(drawingCanvas.getAttribute("height"))
          );
          result.boxes
            .filter(function(box) {
              return box !== result.box;
            })
            .forEach(function(box) {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: "green",
                lineWidth: 2
              });
            });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: "#00F",
            lineWidth: 2
          });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(
            result.line,
            { x: "x", y: "y" },
            drawingCtx,
            { color: "red", lineWidth: 3 }
          );
        }
      }
    });

    Quagga.onDetected(updateBarcode);
  }, [setISBN]);


  return (
      <div>
        <div id="scanner-container" />
        <button onClick={lastStep}> Back </button>
      </div>
  );
};

interface BarcodeScanProps {
  nextStep: () => void,
  setISBN: (isbn: string) => void,
}

class BarcodeScan extends React.Component<BarcodeScanProps> {

  stream: MediaStream;
  videoElement: HTMLVideoElement;

  setupCameraFeed = async () => {
    const videoElement = document.getElementById('asdfVideoThingy') as HTMLVideoElement;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true
    });
    this.stream = stream;
    this.videoElement = videoElement;
    videoElement.srcObject = stream;
    videoElement.play();
  };

  teardownVideoElementAndProceed = () => {
    this.stream.getTracks().forEach(track => track.stop());
    this.stream = null;
    this.videoElement.srcObject = null;
    this.props.nextStep();
  }

  constructor(props: BarcodeScanProps) {
    super(props);
  }

  componentDidMount() {
    this.setupCameraFeed();
  }

  render() {
    return (
      <div>
        <h2>1. Scan Barcode</h2>
        <video id='asdfVideoThingy'></video>
        <button onClick={this.teardownVideoElementAndProceed}>Next</button>
      </div>
    );
  }
}

// ---

class ISBNEntry extends React.Component<BarcodeScanProps> {

  isbn: string;

  setISBNAndContinue: () => void = () => {
    this.props.setISBN(this.isbn);
    this.props.nextStep();
  }

  updateISBN: (event: ChangeEvent<HTMLInputElement>) => void = (event: ChangeEvent<HTMLInputElement>) => {
    this.isbn = event.target.value;
  }

  constructor(props: BarcodeScanProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <h2>1. Enter ISBN</h2>
        ISBN: <input type="text" onChange={this.updateISBN} /> <button onClick={this.setISBNAndContinue}>Find Book</button>
      </div>
    );
  }

}

// ---

interface FindingBookProps {
  bookInfoPromise: () => Promise<void>,
  nextStep: () => void,
}

class FindingBook extends React.Component<FindingBookProps> {

  constructor(props: FindingBookProps) {
    super(props);
    this.props.bookInfoPromise().then(this.props.nextStep);
  }

  render() {
    return (
      <div>
        Finding book... <img src="/throbber.gif" width='16px' height='16px' />
      </div>
    )
  }

}

// ---

interface BookVerifyProps {
  isbn: string,
  bookInfo: BookInfo,
  nextStep: () => void;
  restart: () => void;
}

class IsThisYourBook extends React.Component<BookVerifyProps> {

  constructor(props: BookVerifyProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <h2>2. Is This Your Book?</h2>
        <SeeInfoSetPrice isbn={this.props.isbn} bookInfo={this.props.bookInfo} />
        <button onClick={this.props.restart}>No</button>
        <span>&nbsp;&nbsp;&nbsp;</span>
        <button onClick={this.props.nextStep}>Yes</button>
      </div>
    );
  }

}

// ---

interface SeeInfoSetPriceProps {
  isbn: string,
  bookInfo: BookInfo,
}

function SeeInfoSetPrice(props: SeeInfoSetPriceProps) {
  return (
    <div>
      <div>
        <i>ISBN:</i> {props.isbn}
      </div>
      <div>
        <i>Title:</i> {props.bookInfo.title}
      </div><div>
        <i>Author:</i> {props.bookInfo.author}
      </div>
      <div>
        <i>Edition:</i> {props.bookInfo.edition}
      </div>
    </div>
  );
}

// ---

interface PriceProps {
  isbn: string,
  bookInfo: BookInfo,
  nextStep: () => void;
}

class PriceAndPhotoInput extends React.Component<PriceProps> {
  constructor(props: PriceProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <h2>3. Photo and Price</h2>
        <SeeInfoSetPrice isbn={this.props.isbn} bookInfo={this.props.bookInfo} />
        <hr />
        <div>
          Photo of Textbook: <input type="file" />
        </div>
        <div>
          Listing price of Textbook: $<input type="text" />
        </div>
        <div>
          <button onClick={this.props.nextStep}>Create Post</button>
        </div>
      </div>
    );
  }
}

// ---

function Congrats() {
  return <div>
    <h2>Book Posting Created</h2>
    <p>
      You posting is now live! Make sure to check your messages for offers from buyers.
    </p>
    <button>Back to All Listings</button>
  </div>
}

// ---

function badWizardState() {
  return (
    <div>
      The wizard is currently in an invalid state. Yell at dev.
    </div>
  );
}
