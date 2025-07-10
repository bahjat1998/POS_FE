import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonOperationsService } from '../../services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Input() height: any = '200px'
  uniqueId: string = 'file-input-' + Math.random().toString(36).substring(2, 15);
  @Input() set image(imageUrl: string) {
    this.imageUrl = this.common.getAttachemntUrl(imageUrl);
  }
  @Output() imageSelected = new EventEmitter<any>();

  imageUrl: any;
  constructor(public common: CommonOperationsService) { }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      let fileName = await this.common.saveFiles(file);
      this.imageUrl = this.common.getAttachemntUrl(this.imageUrl)
      this.imageSelected.emit(fileName);
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById(this.uniqueId) as HTMLElement;
    fileInput.click();
  }
}
