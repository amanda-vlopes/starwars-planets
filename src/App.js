import React from 'react';
import './App.css';
import FormFilter from './components/FormFilter';
import Header from './components/Header';
import Table from './components/Table';
import PlanetsProvider from './context/PlanetsProvider';

function App() {
  return (
    <PlanetsProvider>
      <Header />
      <FormFilter />
      <Table />
    </PlanetsProvider>
  );
}

export default App;
