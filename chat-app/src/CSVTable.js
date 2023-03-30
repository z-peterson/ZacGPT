import React from 'react';
import './CSVTable.css';

const CSVTable = ({ parsedData }) => {
  return (
    <table className="CSVTable">
      <tbody>
        {parsedData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CSVTable;
