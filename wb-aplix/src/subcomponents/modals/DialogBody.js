import React, { useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import InputComponent from './InputsDialog';

const DialogComponent = ({ title, fields, handleClose, getValueRefs }) => {
  const renderFields = (fieldRow) => {
    return fieldRow.map((field, index) => (
      <InputComponent
        key={index}
        getValue={getValueRefs}
        id={field.id}
        label={field.label}
        type={field.type}
        placeholder={field.placeholder}
        options={field.options}
      />
    ));
  };

  return (
    <div>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {fields.map((fieldRow, rowIndex) => (
          <div className='Row' key={rowIndex}>
            {renderFields(fieldRow)}
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleClose}>Agregar</Button>
      </DialogActions>
    </div>
  );
};

export default DialogComponent;