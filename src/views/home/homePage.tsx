import React, { Component } from 'react';
import canvasProsesser from '../../utils/canvasUtils'
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { promises } from 'fs';
export default class HomePageComponent extends Component {
  render() {
    return (<div>
      <canvas ref="canvas" style={{ border: "solid 1px #eee" }}></canvas>
      <div>
        <Upload beforeUpload={this.beforeUpload} onChange={this.onChange} action={this.action}>
          <Button type="primary">
            <UploadOutlined></UploadOutlined>
            请选择图片
            </Button>
        </Upload>
        <Button onClick={this.clickButton.bind(this)}>处理</Button>
      </div>

    </div>)
  }

  canvas: any;
  ctx: any;
  action: string = ""
  rgbList: number[] = []
  beforeUpload = (file: any, fileList: any) => {
    console.log(fileList)
    console.log(file)
    new Promise((resove, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img: any = document.createElement('img');
        img.src = reader.result;
        //   const ctx:any=this.canvas.getContext("2d")
        img.onload = () => {
          console.log()
          this.ctx.drawImage(img, 0, 0, 900, 600);
          this.rgbList = this.ctx.getImageData(0, 0, 900, 600)
          resove(this.ctx.getImageData(0, 0, 900, 600))
        }
      }
    }).then(res => {

    })

    return false
  }
  averageBulr(imageData: any, width: number, range: number) {
    let rgbList: number[] = imageData.data
    console.log(rgbList)
    let imgdata = this.ctx.createImageData(900, 600);
    let resultList = imgdata.data;
    let date = new Date
    width = width * 4
    let rowLen = ~~(rgbList.length / width)
    let step = range * 4, current = 0;
    let time1 = date.getTime()
    console.log(rowLen)
    for (let i = 0; i < rowLen; i++) {
      for (let k = 0; k < width; k += 4) {
        let min = k - step, max = k + step, startRow = i - range, endRow = i + range, R = 0, G = 0, B = 0, A = 0, count = 0;
        min = min < 0 ? 0 : min;
        max = max > width ? width : max
        startRow = startRow < 0 ? 0 : startRow
        endRow = endRow > rowLen ? rowLen : endRow
        for (let r = startRow; r < endRow; r++) {
          for (let c = r * width + min; c < r * width + max; c += 4) {
            count++
            R += rgbList[c];
            G += rgbList[c + 1];
            B += rgbList[c + 2];
            A += rgbList[c + 3];
          }
        }
        resultList[current] = (~~(R / count))
        resultList[current + 1] = (~~(G / count))
        resultList[current + 2] = (~~(B / count))
        resultList[current + 3] = (~~(A / count))
        current += 4
      }
    }
    console.log(current)
    date = new Date
    let time2 = date.getTime()
    console.log(`处理耗时${time2 - time1}毫秒`)
    return imgdata

  }
  averageBulr1(imageData: any, width: number, range: number) {
    let rgbList: number[] = imageData.data
    let imgdata = this.ctx.createImageData(900, 600);
    let resultList = imgdata.data;
    let date = new Date
    width = width * 4
    let rowLen = ~~(rgbList.length / width)
    let step = range * 4, current = 0;
    let steplist:number[]=[], columnList: number[]=[]
    let time1 = date.getTime()
    for (let i = 0; i < rowLen; i++) {
      let startRow = i - range, endRow = i + range
      startRow = startRow < 0 ? 0 : startRow
      endRow = endRow > rowLen ? rowLen : endRow
      if (columnList.length == 0) {
        for (let q = 0; q < width; q ++) {
          columnList[q]=0
          for(let s=startRow;s<endRow;s++){
            columnList[q]+=rgbList[q+s*width]
          }
        }
      }
      for (let k = 0; k < width; k += 4) {
        let min = k - step, max = k + step;
        min = min < 0 ? 0 : min;
        max = max > width ? width : max
       if(k===0){
         steplist[k]=0
         steplist[k+1]=0
         steplist[k+2]=0
         steplist[k+3]=0
         for(let x=min;x<max;x+=4){
           steplist[k]+=columnList[x]
           steplist[k+1]+=columnList[x+1]
           steplist[k+2]+=columnList[x+2]
           steplist[k+3]+=columnList[x+3]
         }
       }else{
         if(max-min===2*step){
          if(min===0){
            steplist[k]=steplist[k-4]+columnList[max-4]
            steplist[k+1]=steplist[k-3]+columnList[max-3]
            steplist[k+2]=steplist[k-2]+columnList[max-2]
            steplist[k+3]=steplist[k-1]+columnList[max-1]
          }else{
            steplist[k]=steplist[k-4]+columnList[max-4]-columnList[min-4]
            steplist[k+1]=steplist[k-3]+columnList[max-3]-columnList[min-3]
            steplist[k+2]=steplist[k-2]+columnList[max-2]-columnList[min-2]
            steplist[k+3]=steplist[k-1]+columnList[max-1]-columnList[min-1]
          }
         }else{
           if(min===0&&max===width){
            steplist[k]=steplist[k-4]
            steplist[k+1]=steplist[k-3]
            steplist[k+2]=steplist[k-2]
            steplist[k+3]=steplist[k-1]
           }else if(min===0){
            steplist[k]=steplist[k-4]+columnList[max-4]
            steplist[k+1]=steplist[k-3]+columnList[max-3]
            steplist[k+2]=steplist[k-2]+columnList[max-2]
            steplist[k+3]=steplist[k-1]+columnList[max-1]
          }else if(max===width){
            steplist[k]=steplist[k-4]-columnList[min-4]
            steplist[k+1]=steplist[k-3]-columnList[min-3]
            steplist[k+2]=steplist[k-2]-columnList[min-2]
            steplist[k+3]=steplist[k-1]-columnList[min-1]
          }
         }
       }
        let count=(max-min)*(endRow-startRow)/4
        resultList[current] = (~~(steplist[k] / count))
        resultList[current + 1] = (~~(steplist[k+1] / count))
        resultList[current + 2] = (~~(steplist[k+2] / count))
        resultList[current + 3] = (~~(steplist[k+3] / count))
        current += 4
        if(k===width-4){
          if(endRow-startRow===(step/2)){
              if(endRow===rowLen){
              for(let n=0;n<width;n++){
                let temp=n+startRow*width 
                columnList[n]=columnList[n]-rgbList[temp]
              }
            }else{
              for(let n1=0;n1<width;n1++){
                columnList[n1]=columnList[n1]-rgbList[n1+startRow*width]+rgbList[n1+endRow*width]
             
              }
            }
          }else{
            if(startRow===0&&endRow===rowLen){
            }else if(startRow===0){
              for(let n3=0;n3<width;n3++){
                columnList[n3]=columnList[n3]+rgbList[n3+endRow*width]
              }
            }else if(endRow===rowLen){
              for(let n2=0;n2<width;n2++){
                columnList[n2]=columnList[n2]-rgbList[n2+startRow*width]
              }
            }
          }
        }
      }
    }


    date = new Date
    let time2 = date.getTime()
    console.log(`处理耗时${time2 - time1}毫秒`)
    return imgdata

  }
  convert(imageData: any) {
    let rgbList: number[] = imageData.data
    let date = new Date
    let time1 = date.getTime()
    for (let i = 0; i < rgbList.length; i += 4) {
      let tem: number = ~~((rgbList[i] + rgbList[i + 1] + rgbList[i + 2]) / 3)
      rgbList[i] = tem;
      rgbList[i + 1] = tem;
      rgbList[i + 2] = tem;
    }
    date = new Date
    let time2 = date.getTime()
    console.log(`处理耗时${time2 - time1}毫秒`)
    return imageData
  }
  onChange(info: any) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }



  componentDidMount() {
    this.canvas = this.refs.canvas
    this.canvas.width = 900
    this.canvas.height = 600;
    this.ctx = this.canvas.getContext("2d")
    console.log(this.canvas)
  }
  drawPic() {

  }
  loop() {
    let date = new Date
    let time1 = date.getTime()
    let sum = 1;
    for (let i = 0; i < 10000000; i++) {
      sum += i * 4 - 3 / 5 * 2
    }
    date = new Date
    let time2 = date.getTime()
    console.log(`处理耗时${time2 - time1}毫秒`)
  }
  clickButton() {
    let img: any = this.rgbList
    console.log(img.data)
    for (let i = 0; i < 1; i++) {
      img = this.averageBulr1(img, 900, 100)
    }
    this.ctx.putImageData(img, 0, 0)

  }

}