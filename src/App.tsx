import React, { useState, useEffect } from 'react';
import { indexOf } from 'lodash';
import { v4 as uuid } from 'uuid';
import './App.css';

interface Cell {
  alive: boolean;
  id: string;
}

const nrOfRows = 100
const nrOfCells = 100

function App() {
  const [cellRows, setCellRows] = useState<Cell[][]>([])
  const [evolving, setEvolving] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    setCellRows(generateRndGrid());
  }, []);

  const generateRndGrid = () => {
    const grid: Cell[][] = []

    for (let row = 0; row < nrOfRows; row++) {
      let row: Cell[] = [];
      for (let cell = 0; cell < nrOfCells; cell++) {
        const randomBool = Math.random() >= 0.5;
        const c: Cell = {
          alive: randomBool,
          id: uuid()
        }
        row.push(c);
      }
      grid.push(row);
    }
    return grid;
  }

  const generateEmptyGrid = () => {
    const grid: Cell[][] = []

    for (let row = 0; row < nrOfRows; row++) {
      let row: Cell[] = [];
      for (let cell = 0; cell < nrOfCells; cell++) {
        const c: Cell = {
          alive: false,
          id: uuid()
        }
        row.push(c);
      }
      grid.push(row);
    }
    return grid;
  }

  // const getAliveStateOfCellByPosition = (row: number, cell: number) => {
  //   const r = cellRows[row];
  //   return r[cell].alive;
  // }

  // const getCellByPosition = (row: number, cell: number) => {
  //   const r = cellRows[row];
  //   return r[cell];
  // }

  const evolve = () => {
    const updCellRows = cellRows.map((cellRow) => {
      const rowIndex = indexOf(cellRows, cellRow);
      let cr: Cell[] = [];
      if (rowIndex === 0) {
        //Tis the first row
        cr = getEvolvedFirstRow(cellRow, rowIndex);
      }
      else if (rowIndex === cellRows.length - 1) {
        //Tis the last row
        cr = getEvolvedLastRow(cellRow, rowIndex);
      }
      else {
        //Tis somewhere in between
        cr = cellRow;
        cr = getEvolvedMiddleRow(cellRow, rowIndex);
      }
      return cr
    });
    setCellRows(updCellRows);
  }

  const flipAliveState = (cellId: string) => {
    const updCellRows = cellRows.map((cellRow) => {
      return cellRow.map((c) => {
        if (c.id === cellId) {
          return {
            alive: !c.alive,
            id: c.id
          }
        } else {
          return c;
        }
      });
    });
    setCellRows(updCellRows);
  }


  function getEvolvedFirstRow(cellRow: Cell[], rowIndex: number) {
    const evolvedRow: Cell[] = cellRow.map((c) => {
      const cellIndex = indexOf(cellRow, c);
      if (cellIndex === 0) {
        //First cell in first row
        const neighbours: Cell[] = [];
        neighbours.push(cellRow[cellIndex + 1]);
        neighbours.push(cellRows[rowIndex + 1][cellIndex]);
        neighbours.push(cellRows[rowIndex + 1][cellIndex + 1]);
        const aliveNeighbours = getNrOfAliveNeighbours(neighbours);
        return getEvolvedCell(aliveNeighbours, c)
        // evolvedRow.push(getEvolvedCell(aliveNeighbours, c));
      } else if (cellIndex === cellRow.length - 1) {
        // Last cell in first row
        const neighbours: Cell[] = [];
        neighbours.push(cellRow[cellIndex - 1]);
        neighbours.push(cellRows[rowIndex + 1][cellIndex]);
        neighbours.push(cellRows[rowIndex + 1][cellIndex - 1]);
        const aliveNeighbours = getNrOfAliveNeighbours(neighbours);
        return getEvolvedCell(aliveNeighbours, c)
        // evolvedRow.push(getEvolvedCell(aliveNeighbours, c));
      }
      else {
        // Some cell in between in first row
        const neighbours: Cell[] = [];
        neighbours.push(cellRow[cellIndex - 1]);
        neighbours.push(cellRow[cellIndex + 1]);
        neighbours.push(cellRows[rowIndex + 1][cellIndex - 1]);
        neighbours.push(cellRows[rowIndex + 1][cellIndex]);
        neighbours.push(cellRows[rowIndex + 1][cellIndex + 1]);
        const aliveNeighbours = getNrOfAliveNeighbours(neighbours);
        return getEvolvedCell(aliveNeighbours, c)
        // evolvedRow.push(getEvolvedCell(aliveNeighbours, c));
      }
    });
    return evolvedRow;
  }

  function getEvolvedMiddleRow(cellRow: Cell[], rowIndex: number) {
    const evolvedRow: Cell[] = cellRow.map((c) => {
      const cellIndex = indexOf(cellRow, c);
      if (cellIndex === 0) {
        //First cell in middle row
        const neighbours: Cell[] = [];
        neighbours.push(cellRow[cellIndex + 1]);
        neighbours.push(cellRows[rowIndex - 1][cellIndex]);
        neighbours.push(cellRows[rowIndex - 1][cellIndex + 1]);
        neighbours.push(cellRows[rowIndex + 1][cellIndex]);
        neighbours.push(cellRows[rowIndex + 1][cellIndex + 1]);
        const aliveNeighbours = getNrOfAliveNeighbours(neighbours);
        return getEvolvedCell(aliveNeighbours, c)
      } else if (cellIndex === cellRow.length - 1) {
        // Last cell in middle row
        const neighbours: Cell[] = [];
        neighbours.push(cellRow[cellIndex - 1]);
        neighbours.push(cellRows[rowIndex - 1][cellIndex]);
        neighbours.push(cellRows[rowIndex - 1][cellIndex - 1]);
        neighbours.push(cellRows[rowIndex + 1][cellIndex]);
        neighbours.push(cellRows[rowIndex + 1][cellIndex - 1]);
        const aliveNeighbours = getNrOfAliveNeighbours(neighbours);
        return getEvolvedCell(aliveNeighbours, c)
      }
      else {
        // Some cell in between in middle row
        const neighbours: Cell[] = [];
        neighbours.push(cellRow[cellIndex - 1]);
        neighbours.push(cellRow[cellIndex + 1]);
        neighbours.push(cellRows[rowIndex - 1][cellIndex - 1]);
        neighbours.push(cellRows[rowIndex - 1][cellIndex]);
        neighbours.push(cellRows[rowIndex - 1][cellIndex + 1]);
        neighbours.push(cellRows[rowIndex + 1][cellIndex - 1]);
        neighbours.push(cellRows[rowIndex + 1][cellIndex]);
        neighbours.push(cellRows[rowIndex + 1][cellIndex + 1]);
        const aliveNeighbours = getNrOfAliveNeighbours(neighbours);
        return getEvolvedCell(aliveNeighbours, c)
      }
    });
    return evolvedRow;
  }

  function getEvolvedLastRow(cellRow: Cell[], rowIndex: number) {
    const evolvedRow: Cell[] = cellRow.map((c) => {
      const cellIndex = indexOf(cellRow, c);
      if (cellIndex === 0) {
        //First cell in last row
        const neighbours: Cell[] = [];
        neighbours.push(cellRow[cellIndex + 1]);
        neighbours.push(cellRows[rowIndex - 1][cellIndex]);
        neighbours.push(cellRows[rowIndex - 1][cellIndex + 1]);
        const aliveNeighbours = getNrOfAliveNeighbours(neighbours);
        return getEvolvedCell(aliveNeighbours, c)
      } else if (cellIndex === cellRow.length - 1) {
        // Last cell in last row
        const neighbours: Cell[] = [];
        neighbours.push(cellRow[cellIndex - 1]);
        neighbours.push(cellRows[rowIndex - 1][cellIndex]);
        neighbours.push(cellRows[rowIndex - 1][cellIndex - 1]);
        const aliveNeighbours = getNrOfAliveNeighbours(neighbours);
        return getEvolvedCell(aliveNeighbours, c)
      }
      else {
        // Some cell in between in last row
        const neighbours: Cell[] = [];
        neighbours.push(cellRow[cellIndex - 1]);
        neighbours.push(cellRow[cellIndex + 1]);
        neighbours.push(cellRows[rowIndex - 1][cellIndex - 1]);
        neighbours.push(cellRows[rowIndex - 1][cellIndex]);
        neighbours.push(cellRows[rowIndex - 1][cellIndex + 1]);
        const aliveNeighbours = getNrOfAliveNeighbours(neighbours);
        return getEvolvedCell(aliveNeighbours, c)
      }
    });
    return evolvedRow;
  }

  function getNrOfAliveNeighbours(neighbours: Cell[]) {
    return neighbours.filter((cell) => cell.alive).length;
  }

  function getEvolvedCell(aliveNeighbours: number, cell: Cell) {
    if (aliveNeighbours === 3) {
      return {
        alive: true,
        id: cell.id
      }
    } else if (cell.alive && aliveNeighbours === 2) {
      return {
        alive: true,
        id: cell.id
      }
    } else {
      return {
        alive: false,
        id: cell.id
      }
    }
  }

  const goEvolution = () => {
    const flippedEvolving = !evolving;
    setEvolving(flippedEvolving);
    let evolveInterval;
    if (flippedEvolving) {
      const evo = document.getElementById('evolve');
      if (evo) {
        evo.click();
        evolveInterval = window.setInterval(() => evo.click(), 250);
      }
    } else {
      window.clearInterval();
    }
  }

  const handleMouseDown = () => {
    setClicking(true);
  }

  const handleMouseUp = () => {
    setClicking(false);
  }

  const handleMouseOverCell = (cell: Cell) => {
    if (!clicking || cell.alive) {
      return;
    }
    flipAliveState(cell.id);
  }

  return (
    <div className='app center-children'>
      <div className='game center-children'>
        <div
          className='game-grid'
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}>
          {cellRows.map((cellRow) => {
            return (
              <div key={JSON.stringify(cellRow)} className='cell-row'>{cellRow.map((cell) => {
                return cell.alive ?
                  <div key={JSON.stringify(cell)} onClick={() => flipAliveState(cell.id)} onMouseOver={() => handleMouseOverCell(cell)} className='alive-cell' /> :
                  <div key={JSON.stringify(cell)} onClick={() => flipAliveState(cell.id)} onMouseOver={() => handleMouseOverCell(cell)} className='dead-cell' />
              })}
              </div>
            )
          })}
        </div>
        <div className='button-row'>
          <button className='btn' onClick={() => setCellRows(generateRndGrid())}>Generate new grid</button>
          <button className='btn' onClick={() => setCellRows(generateEmptyGrid())}>Generate empty grid</button>
          <button className='btn' id='evolve' onClick={evolve}>Evolve once</button>
          <button className='btn' onClick={goEvolution}>Let it go</button>

        </div>
      </div>
    </div>
  );
}

export default App;

//