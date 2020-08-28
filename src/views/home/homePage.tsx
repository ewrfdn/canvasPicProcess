import React ,{Component}from 'react';
import canvasProsesser  from '../../utils/canvasUtils'
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { promises } from 'fs';
export default class HomePageComponent extends Component {
    render() {
        return (<div>
            <canvas ref="canvas" style={{border:"solid 1px #eee"}}></canvas>
            <div>
            <Upload beforeUpload={this.beforeUpload} onChange={this.onChange}  action={this.action}>
            <Button type="primary">
            <UploadOutlined></UploadOutlined>
            请选择图片
            </Button>
            </Upload>
            <Button onClick={this.clickButton}>处理</Button>
            </div>
        
        </div>)
    }

    canvas:any;
    ctx:any;
    action:string=""
    beforeUpload=(file:any,fileList:any)=>{
        console.log(fileList)
        console.log(file)
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const img:any = document.createElement('img');
          img.src = reader.result;
        //   const ctx:any=this.canvas.getContext("2d")
          img.onload = () => {
            this.ctx.drawImage(img, 0, 0);
           }}
        return false
    }
    onChange(info:any) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
  ;
 
    
    componentDidMount(){
        this.canvas=this.refs.canvas
        this.canvas.width=600;
        this.canvas.height=400;
        this.ctx=this.canvas.getContext("2d")
        console.log(this.canvas)
    }
    drawPic(){
        
    }   
    clickButton(){

    }

}