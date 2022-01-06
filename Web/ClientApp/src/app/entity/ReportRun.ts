export class ReportRun {

  public categoryId: number;
  public modelId: number;
  public action: number;  // 0 => Create; 1 => Download

  constructor(categoryId: number, modelId: number, action: number) {
    this.categoryId = categoryId;
    this.modelId = modelId;
    this.action = action;
  }

}
