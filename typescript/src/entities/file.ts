import { Entity } from '../entity';

export class MerchiFile extends Entity {
  protected static resourceName: string = "files";
  protected static singularName: string = "file";
  protected static pluralName: string = "files";

  protected fileData?: File;

  @MerchiFile.property("id")
  private _id?: number;

  get id(): number | undefined {
    return this._id;
  }

  set id(newId: number | undefined) {
    this._id = newId;
    this.markDirty("id", newId);
  }

  public fromFormFile = (file: File) => {
    this.fileData = file;
  }
}
