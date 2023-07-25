import React from 'react';
import { Handle, Position } from 'reactflow';
import Tag from '../ui/Tag';


const customNodeStyles = {
  width: 65,
  height: 75,
  padding: "4px 12px 10px 4px",
  background: '#2B3546',
  color: '#000',
  borderRadius: "10px",
  zIndex: 10,
  fontSize: "10px",
}

interface IData {
  label: string;
}
  export default function ExporterNode({data}: {data:IData}) {

  return (
    <div 
    style={customNodeStyles}
    >
      <Tag tag="Exporter"/>
      <Handle type="source" position={Position.Left}/>
      <div className='w-full flex justify-center items-center flex-col'>
        <div className='text-white'>Icon</div>
        <div className='text-white'>{data.label}</div>
      </div>
    </div>
  );
}