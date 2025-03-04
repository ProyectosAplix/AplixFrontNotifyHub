import MUIDataTable from "mui-datatables";
import React from "react";
import "../css/Table.css"

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Agrega ceros iniciales si es necesario
  const day = String(today.getDate()).padStart(2, '0'); // Agrega ceros iniciales si es necesario
  return `${year}-${month}-${day}`;
};

const Table = ({ title, data, columns, customToolbarSelectFunction, setSelectedRows,setSelectableRows }) => {
  const options = {
    selectableRows: setSelectableRows,
    print: false,
    responsive: "standard",
    textLabels: {
      body: {
        noMatch: "No se han encontrado resultados con los datos digitados",
        toolTip: "Ordenar",
        columnHeaderTooltip: column => `Ordenar ${column.label}`
      },
      pagination: {
        next: "Siguiente Página",
        previous: "Anterior Página",
        rowsPerPage: "Filas por página:",
        displayRows: "de"
      },
      toolbar: {
        search: "Buscar",
        downloadCsv: "Descargar CSV",
        print: "Imprimir",
        viewColumns: "Ver Columnas",
        filterTable: "Filtrar Tabla",
      },
      filter: {
        all: "Todos",
        title: "Filtros",
        reset: "Reiniciar",
      },
      viewColumns: {
        title: "Mostrar Columnas",
        titleAria: "Mostrar/Ocultar Columnas",
      },
      selectedRows: {
        text: "Fila(s) seleccionada",
        delete: "Eliminar",
        deleteAria: "Eliminar Columna Seleccionada",
      },
    },
    
    downloadOptions: {
            filename: `${title}_${getCurrentDate()}.csv`,
            separator: ',',
            filterOptions: {
                useDisplayedColumnsOnly: true, // Solo descargar las columnas visibles
                useDisplayedRowsOnly: false
            },
        },
        onDownload: (buildHead, buildBody, columns, data) => {
            // Construir el CSV con el BOM UTF-8
            const csv = "\uFEFF" + buildHead(columns) + buildBody(data);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title}_${getCurrentDate()}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            return false; // Return false to avoid default onDownload behavior
        },
    customToolbarSelect: customToolbarSelectFunction,
    onRowSelectionChange: (currentRowsSelected, allRowsSelected) => {
      setSelectedRows(allRowsSelected);
    }
  };

  return (
    <div>
      <MUIDataTable
        title={title}
        data={data}
        columns={columns}
        options={options}
      />
    </div>
  );
}

export default Table;
