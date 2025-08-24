import { TileGrid } from '@jc/ui-components';
import { FileSystem } from '../data/file-system';

export default function TileGridPage() {
  return <TileGrid gridTiles={FileSystem} />;
}
