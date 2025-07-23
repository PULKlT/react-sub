// src/App.tsx

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import type { DataTablePageEvent, DataTableSelectionChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

// Import our updated service and types
import { fetchArtworks } from './services/api';
import type { Artwork } from './services/api';


function App() {
  // State updated to use Artwork type
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const [selection, setSelection] = useState<Map<number, boolean>>(new Map());
  const toast = useRef<Toast>(null);

  // Function renamed to reflect what it's loading
  const loadArtworks = (page: number, limit: number) => {
    setLoading(true);
    fetchArtworks(page, limit) // Calling the new service function
      .then(response => {
        setArtworks(response.data);
        setTotalRecords(response.totalRecords);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch artworks:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadArtworks(1, rows); // Initial load
  }, []);

  const onPageChange = (event: DataTablePageEvent) => {
    setFirst(event.first);
    setRows(event.rows);
    loadArtworks(event.page + 1, event.rows);
  };

  const onSelectionChange = (event: DataTableSelectionChangeEvent<Artwork[]>) => {
    const newSelection = new Map(selection);
    const currentPageIds = artworks.map(p => p.id);

    currentPageIds.forEach(id => {
        if (newSelection.has(id) && !event.value.some(item => item.id === id)) {
            newSelection.delete(id);
        }
    });

    event.value.forEach(item => {
        if (!newSelection.has(item.id)) {
            newSelection.set(item.id, true);
        }
    });

    setSelection(newSelection);
  };

  // Logic updated to use the `artworks` state
  const selectedItemsOnCurrentPage = artworks.filter(artwork => selection.has(artwork.id));

  const header = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>Artworks from the Art Institute of Chicago</span>
      <div style={{ textAlign: 'left' }}>
        <strong>Selection Panel</strong>
        <div>
          <span>{selection.size} row(s) selected across all pages.</span>
          <Button 
            label="Clear All Selections" 
            icon="pi pi-times" 
            className="p-button-sm p-button-danger"
            onClick={() => {
                setSelection(new Map());
                toast.current?.show({ severity: 'info', summary: 'Cleared', detail: 'All selections have been cleared', life: 3000 });
            }}
            style={{marginLeft: '1rem'}}
            disabled={selection.size === 0}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="card" style={{ padding: '2rem' }}>
        <Toast ref={toast} />
        <DataTable
            value={artworks} // Use the artworks state
            lazy
            paginator
            first={first}
            rows={rows}
            totalRecords={totalRecords}
            onPage={onPageChange}
            loading={loading}
            tableStyle={{ minWidth: '75rem' }} // Increased width for more columns
            dataKey="id"
            selection={selectedItemsOnCurrentPage}
            onSelectionChange={onSelectionChange}
            selectionMode="checkbox"
            header={header}
        >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
            {/* --- COLUMNS UPDATED TO DISPLAY NEW FIELDS --- */}
            <Column field="title" header="Title" style={{width: '25%'}}></Column>
            <Column field="artist_display" header="Artist" style={{width: '25%'}}></Column>
            <Column field="place_of_origin" header="Origin" style={{width: '10%'}}></Column>
            <Column field="date_start" header="Start Date" style={{width: '10%'}}></Column>
            <Column field="date_end" header="End Date" style={{width: '10%'}}></Column>
            <Column field="inscriptions" header="Inscriptions" style={{width: '20%'}}></Column>
        </DataTable>
    </div>
  );
}

export default App;