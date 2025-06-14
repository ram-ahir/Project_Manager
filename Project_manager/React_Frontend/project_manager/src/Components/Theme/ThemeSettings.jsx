import React from 'react';
import { useTheme } from '../../Context/ThemeContext';
import { Card, Form, Row, Col } from 'react-bootstrap';

const ThemeSettings = () => {
  const {
    gridHeaderStyle,
    selectedRowStyle,
    setGridHeaderStyle,
    setSelectedRowStyle
  } = useTheme();

  const handleHeaderColorChange = (e) => {
    setGridHeaderStyle(prev => ({ ...prev, backgroundColor: e.target.value }));
  };

  const handleHeaderTextColorChange = (e) => {
    setGridHeaderStyle(prev => ({ ...prev, color: e.target.value }));
  };

  const handleRowColorChange = (e) => {
    setSelectedRowStyle(prev => ({ ...prev, backgroundColor: e.target.value }));
  };

  const handleRowTextColorChange = (e) => {
    setSelectedRowStyle(prev => ({ ...prev, color: e.target.value }));
  };

  return (
    <Card className="shadow p-4">
      <h5 className="mb-4 text-center">🎨 Customize Theme</h5>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Header Background</Form.Label>
            <Form.Control type="color" value={gridHeaderStyle.backgroundColor} onChange={handleHeaderColorChange} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Header Text Color</Form.Label>
            <Form.Control type="color" value={gridHeaderStyle.color} onChange={handleHeaderTextColorChange} />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Selected Row Background</Form.Label>
            <Form.Control type="color" value={selectedRowStyle.backgroundColor} onChange={handleRowColorChange} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Selected Row Text Color</Form.Label>
            <Form.Control type="color" value={selectedRowStyle.color} onChange={handleRowTextColorChange} />
          </Form.Group>
        </Col>
      </Row>

      <hr />
      <div className="text-center">
        <h6>🔍 Preview</h6>
        <table className="table table-bordered mt-2">
          <thead>
            <tr>
              <th style={gridHeaderStyle}>Header 1</th>
              <th style={gridHeaderStyle}>Header 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Normal Row</td>
              <td>---</td>
            </tr>
            <tr>
              <td  style={selectedRowStyle}>Selected Row</td>
              <td  style={selectedRowStyle}>Preview</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ThemeSettings;
