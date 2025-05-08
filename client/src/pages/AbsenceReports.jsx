import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from './TableComponents';
import { Badge } from './Badge';
import { Button } from './Button';

const AbsenceReportsTable = ({ reports }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewDetails = (studentId) => {
    // Implement view details logic here
    console.log(`View details for student ID: ${studentId}`);
  };

  const filteredReports = reports.filter((report) =>
    report.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search by student name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student Name</TableCell>
            <TableCell>Student Identifier</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Semester</TableCell>
            <TableCell className="text-center">Total Absence Hours</TableCell>
            <TableCell>Status</TableCell>
            <TableCell className="text-right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <TableRow key={report.studentId}>
                <TableCell className="font-medium">{report.studentName}</TableCell>
                <TableCell>{report.studentIdentifier}</TableCell>
                <TableCell>{report.departmentName}</TableCell>
                <TableCell>{report.semesterName}</TableCell>
                <TableCell className="text-center">{report.totalAbsenceHours}</TableCell>
                <TableCell>
                  <Badge
                    variant={report.totalAbsenceHours > 9 ? 'destructive' : 'secondary'}
                  >
                    {report.totalAbsenceHours > 9 ? 'Exceeded Limit' : 'Normal'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(report.studentId)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                {searchQuery ? 'No reports match your search.' : 'No absence reports found.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AbsenceReportsTable;