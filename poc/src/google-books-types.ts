export interface GoogleBooksResponse {
  kind: Kind;
  totalItems: number;
  items: GoogleBookVolume[];
}

export interface GoogleBookVolume {
  shelf?: string;
  kind?: Kind;
  id?: string;
  etag?: string;
  selfLink?: string;
  volumeInfo: VolumeInfo;
  saleInfo?: SaleInfo;
  accessInfo?: AccessInfo;
  searchInfo?: SearchInfo;
  error?: TopLevelError;
  layerInfo?: LayerInfo;
  highlight?: boolean;
}

export interface AccessInfo {
  country: Country;
  viewability: Viewability;
  embeddable: boolean;
  publicDomain: boolean;
  textToSpeechPermission: TextToSpeechPermission;
  epub: Epub;
  pdf: Epub;
  webReaderLink: string;
  accessViewStatus: AccessViewStatus;
  quoteSharingAllowed: boolean;
}

export enum AccessViewStatus {
  None = 'NONE',
  Sample = 'SAMPLE',
}

export enum Country {
  CA = 'CA',
}

export interface Epub {
  isAvailable: boolean;
  acsTokenLink?: string;
}

export enum TextToSpeechPermission {
  Allowed = 'ALLOWED',
  AllowedForAccessibility = 'ALLOWED_FOR_ACCESSIBILITY',
}

export enum Viewability {
  NoPages = 'NO_PAGES',
  Partial = 'PARTIAL',
}

export interface TopLevelError {
  code: number;
  message: string;
  errors: ErrorElement[];
  status: Status;
}

export interface ErrorElement {
  message: string;
  domain: Domain;
  reason: Reason;
}

export enum Domain {
  Global = 'global',
}

export enum Reason {
  RateLimitExceeded = 'rateLimitExceeded',
}

export enum Status {
  ResourceExhausted = 'RESOURCE_EXHAUSTED',
}

export enum Kind {
  BooksVolume = 'books#volume'
}

export interface LayerInfo {
  layers: Layer[];
}

export interface Layer {
  layerId: string;
  volumeAnnotationsVersion: string;
}

export interface SaleInfo {
  country: Country;
  saleability: Saleability;
  isEbook: boolean;
  listPrice?: SaleInfoListPrice;
  retailPrice?: SaleInfoListPrice;
  buyLink?: string;
  offers?: Offer[];
}

export interface SaleInfoListPrice {
  amount: number;
  currencyCode: CurrencyCode;
}

export enum CurrencyCode {
  CAD = 'CAD',
}

export interface Offer {
  finskyOfferType: number;
  listPrice: OfferListPrice;
  retailPrice: OfferListPrice;
  giftable: boolean;
}

export interface OfferListPrice {
  amountInMicros: number;
  currencyCode: CurrencyCode;
}

export enum Saleability {
  ForSale = 'FOR_SALE',
  NotForSale = 'NOT_FOR_SALE',
}

export interface SearchInfo {
  textSnippet: string;
}

export type Book = VolumeInfo;

export interface VolumeInfo {
  title: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: IndustryIdentifier[];
  readingModes: ReadingModes;
  pageCount?: number;
  printType: PrintType;
  categories?: string[];
  maturityRating: MaturityRating;
  allowAnonLogging: boolean;
  contentVersion: string;
  imageLinks?: ImageLinks;
  language: string;
  previewLink: string;
  infoLink: string;
  canonicalVolumeLink: string;
  printedPageCount?: number;
  panelizationSummary?: PanelizationSummary;
  dimensions?: Dimensions;
  averageRating?: number;
  ratingsCount?: number;
  subtitle?: string;
  comicsContent?: boolean;
  mainCategory?: string;
  key: string;
}

export interface Dimensions {
  height: string;
  width?: string;
  thickness?: string;
}

export interface ImageLinks {
  smallThumbnail: string;
  thumbnail: string;
  small?: string;
  medium?: string;
  large?: string;
  extraLarge?: string;
}

export interface IndustryIdentifier {
  type: Type;
  identifier: string;
}

export enum Type {
  Isbn10 = 'ISBN_10',
  Isbn13 = 'ISBN_13',
  Other = 'OTHER',
}

export enum MaturityRating {
  Mature = 'MATURE',
  NotMature = 'NOT_MATURE',
}

export interface PanelizationSummary {
  containsEpubBubbles: boolean;
  containsImageBubbles: boolean;
}

export enum PrintType {
  Book = 'BOOK',
}

export interface ReadingModes {
  text: boolean;
  image: boolean;
}
