import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "../../css/DragAndDrop.css";


export function Item(props) {
    const { id } = props;
  
  
    return <div className="DivItems">{id}</div>;
  }
  
  export default function CardItems(props) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition
    } = useSortable({ id: props.id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    };
  
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Item id={props.id} />
      </div>
    );
  }
  