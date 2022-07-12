import { Entity } from '../entity';
import { MerchiFile } from './file';

export class Backup extends Entity {
  protected static resourceName = 'backups';
  protected static singularName = 'backup';
  protected static pluralName = 'backups';

  @Backup.property()
  public id?: number;

  @Backup.property()
  public file?: MerchiFile;
}
