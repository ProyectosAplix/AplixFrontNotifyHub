import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";


import "../css/DragAndDrop.css";
import CardItems from "../subcomponents/D&D/CardItems";


  
  export default function Container(props) {
    const { id, items } = props;
  
    const { setNodeRef } = useDroppable({
      id
    });
  
    return (
      <SortableContext
        id={id}
        items={items}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="DivContainer">
          {items.map((id) => (
            <CardItems key={id} id={id} />
          ))}
        </div>
      </SortableContext>
    );
  }
  