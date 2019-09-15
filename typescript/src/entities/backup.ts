import { Entity } from '../entity';
import { MerchiFile } from './file';

export class Backup extends Entity {
  protected static resourceName: string = "backups";
  protected static singularName: string = "backup";
  protected static pluralName: string = "backups";

  @Backup.property()
  public id?: number;

  @Backup.property()
  public file?: MerchiFile;
}
