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
            <Button onClick={this.loop.bind(this)}>处理</Button>
            </div>
        
        </div>)
    }

    canvas:any;
    ctx:any;
    action:string=""
    rgbList:number[]=[]
    beforeUpload=(file:any,fileList:any)=>{
        console.log(fileList)
        console.log(file)
        new Promise((resove,reject)=>{
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              const img:any = document.createElement('img');
              img.src = reader.result;
            //   const ctx:any=this.canvas.getContext("2d")
              img.onload = () => {
                  console.log()
                  this.ctx.drawImage(img, 0, 0,1800,1200);
                  this.rgbList=this.ctx.getImageData(0,0,1800,1200)
                resove(this.ctx.getImageData(0,0,1800,1200))
               }}
        }).then(res=>{
            
        })
      
        return false
    }
    convert(imageData:any){
        let rgbList:number[]=imageData.data
        let date=new Date
        let time1=date.getTime()
        for(let i=0;i<rgbList.length;i+=4){
            let tem:number=~~((rgbList[i]+rgbList[i+1]+rgbList[i+2])/3)
            rgbList[i]=tem;
            rgbList[i+1]=tem;
            rgbList[i+2]=tem;
        }
         date=new Date
        let time2=date.getTime()
        console.log(`处理耗时${time2-time1}毫秒`)
        return imageData
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
  
 
    
    componentDidMount(){
        this.canvas=this.refs.canvas
        this.canvas.width=1800;
        this.canvas.height=1200;
        this.ctx=this.canvas.getContext("2d")
        console.log(this.canvas)
    }
    drawPic(){
        
    }
    loop(){
        let date=new Date
        let time1=date.getTime()
        let sum=1;
        for(let i=0;i<10000000;i++){
            sum+=i*4-3/5*2
        }
        date=new Date
        let time2=date.getTime()
        console.log(`处理耗时${time2-time1}毫秒`)
    }   
    clickButton(){
        this.ctx.putImageData(this.convert(this.rgbList),0,0)

    }

}