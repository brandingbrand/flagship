import type { ComponentList } from '../types';

import { CTABlock } from './CTABlock';
import { CTARow } from './CTARow';
import { Card } from './Card';
import { Container } from './Container';
import CustomCarouselBlock from './CustomCarouselBlock';
import { DismissibleBanner } from './DismissibleBanner';
import { DisplayNameMessage } from './DisplayNameMessage';
import DividerBlock from './DividerBlock';
import EventBlock from './EventBlock';
import { EventCard } from './EventCard';
import { FeaturedTopCard } from './FeaturedTopCard';
import FullScreenImageCard from './FullScreenImageCard';
import GridWallBlock from './GridWallBlock';
import IconText from './IconTextBlock';
import { ImageBlock } from './ImageBlock';
import { ImageCard } from './ImageCard';
import ImageCarouselBlock from './ImageCarouselBlock';
import ImageGrid from './ImageGrid';
import ImageWithOverlay from './ImageWithOverlay';
import ImageWithText from './ImageWithTextBlock';
import InboxWrapper from './InboxWrapper';
import ProductCarouselBlock from './ProductCarouselBlock';
import { RecipeBlock } from './RecipeBlock';
import RoundedImageCard from './RoundedImageCard';
import ShareBlock from './ShareBlock';
import ShopIngredientsBlock from './ShopIngredientsBlock';
import { SideBySideImages } from './SideBySideImages';
import SimpleCard from './SimpleCard';
import StackedButtons from './StackedButtons';
import Story from './Story';
import TextBanner from './TextBanner';
import { TextBlock } from './TextBlock';
import { TextWithButton } from './TextWithButton';
import TextWithIconBlock from './TextWithIconBlock';
import { TitleWithLink } from './TitleWithLink';
import TwinCTABlock from './TwinCTABlock';
import { VideoBlock } from './VideoBlock';
import { VideoCard } from './VideoCard';
import WhiteInboxWrapper from './WhiteInboxWrapper';

const layoutComponents: ComponentList = {
  Text: TextBlock,
  Image: ImageBlock,
  CTA: CTABlock,
  Video: VideoBlock,
  TwinCTA: TwinCTABlock,
  Event: EventBlock,
  Card,
  Divider: DividerBlock,
  WhiteInboxWrapper,
  ImageCarousel: ImageCarouselBlock,
  ProductCarousel: ProductCarouselBlock,
  GridWall: GridWallBlock,
  TextWithIcon: TextWithIconBlock,
  InboxWrapper,
  FeaturedTopCard,
  RoundedImageCard,
  FullScreenImageCard,
  ImageGrid,
  EventCard,
  SimpleCard,
  Share: ShareBlock,
  ShopIngredients: ShopIngredientsBlock,
  story: Story,
  RecipeList: RecipeBlock,
  ImageWithOverlay,
  TextBanner,
  ImageCard,
  VideoCard,
  ImageWithText,
  StackedButtons,
  TitleWithLink,
  CustomCarousel: CustomCarouselBlock,
  IconText,
  DisplayNameMessage,
  DismissibleBanner,
  Container,
  TextWithButton,
  CTARow,
  SideBySideImages,
};

export default layoutComponents;
