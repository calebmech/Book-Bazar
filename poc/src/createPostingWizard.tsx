import React, { ChangeEvent } from "react";

interface Props {

}
interface State {
  wizardStep: number,
  isUseBarcodeImage: boolean,
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

  private setUseBarcodeImage: (isUseBarcodeImage: boolean) => void = (isUseBarcodeImage) => {
    this.setState((_state: State) => {
      return {
        isUseBarcodeImage: isUseBarcodeImage
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
      isUseBarcodeImage: true,
      bookInfo: null,
    };
  }

  render() {
    switch (this.state.wizardStep) {
      case 0:
        return <SelectCameraOrManual nextStep={this.nextStep} setUseBarcodeImage={this.setUseBarcodeImage} />;
      case 1:
        if (this.state.isUseBarcodeImage) {
          return <BarcodeScan nextStep={this.nextStep} setISBN={this.setISBN} />;
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

interface CameraOrManualProps {
  nextStep: () => void,
  setUseBarcodeImage: (isUseBarcodeImage: boolean) => void
}

class SelectCameraOrManual extends React.Component<CameraOrManualProps> {

  private scanBarcodeClicked: () => void;
  private typeISBNClicked: () => void;

  constructor(props: CameraOrManualProps) {
    super(props);
    this.scanBarcodeClicked = () => {
      props.setUseBarcodeImage(true);
      props.nextStep();
    };
    this.typeISBNClicked = () => {
      props.setUseBarcodeImage(false);
      props.nextStep();
    };
  }

  render() {
    return (
      <div>
        <p>The first step to making a book posting is getting the book information. You can either scan the barcode with your camera or type in the ISBN. We will handle getting the title, author, and edition for you.</p>
        <div>
          <button onClick={this.scanBarcodeClicked}>Scan Barcode</button>
          <span>&nbsp;&nbsp;&nbsp;</span>
          <button onClick={this.typeISBNClicked}>Type in ISBN</button>
        </div>
      </div>
    )
  }

}

// ---

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
