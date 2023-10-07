import '../styles/App.css';
import { useState, useEffect } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import products from '../service/products.json'
import orders from '../service/orders.json'
import { format } from 'date-fns';
import imgClear from '../styles/imgs/delete.png'
import imgSearch from '../styles/imgs/magnifying-glass.png'
import imgEdit from '../styles/imgs/edit.png'
import { Link } from 'react-router-dom'
function OrderSearch() {
	const [activeStatus , setActiveStatus] = useState(false)
	const [disabled , setDisabled] = useState(true)
	const [alertError , setAlertError] = useState(false)
	const [selected , setSelected] = useState(false)
	const [orderNumber , setOrderNumber] = useState('')
	const [valueEmployee , setValueEmployee] = useState()
	const [valueCity , setValueCity] = useState()
	const [valueStatus , setValueStatus] = useState()
	const [isStatus , setIsStatus] = useState(false)
	const [columnsTable , setColumnsTable] = useState()
	const [showDataTable , setShowDataTable] = useState()
	const prod = products.products;
	const order = orders.orders;
    const arr = []
	let data = []
	const arrFilter = []
	const listItemsEmployee = [];
	const listItemsCity = [];
	createTheme('solarized', {
		text: {
		  primary: '#FFF',
		  secondary: '#FFF',
		},
		background: {
		  default: '#002b36',
		},
		context: {
		  background: '#cb4b16',
		  text: '#FFFFFF',
		},
		divider: {
		  default: '#073642',
		},
		action: {
		  button: 'rgba(0,0,0,.54)',
		  hover: 'rgba(0,0,0,.08)',
		  disabled: 'rgba(0,0,0,.12)',
		},
	}, 'dark');
	const customStyles = {
		rows: {
			style: {
				minHeight: '72px', 
			},
		},
		headCells: {
			style: {
				paddingLeft: '8px', 
				paddingRight: '8px',
				fontSize:'1rem',
				justifyContent:'center',
				backgroundColor:'#000'
			},
		},
		cells: {
			style: {
				paddingLeft: '8px', 
				paddingRight: '8px',
				justifyContent:'center'
			},
		},
	};
	order.forEach((element) =>{
		arr.push(element)
		listItemsEmployee.push(element.Employee);
		listItemsCity.push(element.CustomerStoreCity);
	});
	arr.map((value) => {
		data.push({
			ID:value.ID,
			Status:value.Status,
			OrderNumber:value.OrderNumber,
			OrderDate:value.OrderDate,
			DeliveryDate:value.DeliveryDate,
			SaleAmount:value.SaleAmount,
			Employee:value.Employee,
			CustomerStoreCity:value.CustomerStoreCity,
		})
	})
	
	let filterArrayOption = listItemsEmployee.filter(function(item, pos) {
		return listItemsEmployee.indexOf(item) == pos;
	})
	let filterArrayCity = listItemsCity.filter(function(item, pos) {
		return listItemsCity.indexOf(item) == pos;
	})
	let USDollar = new Intl.NumberFormat('en-US', {
		currency: 'USD',
	});
	const columns = []
	columns.push(
	{
		name: 'Invoice Number',
		sortable:true,
		selector: row => row.OrderNumber,
		cell:(row) => (
			<div className='boxOrderNumber'>
				<span>{row.OrderNumber}</span>
				<Link to={`detail/${row.OrderNumber}`} variant="info" >
					<img src={imgEdit} alt="" />
				</Link>
			</div>
		)
	},
	{
		name: 'Order Date',
		sortable:true,
		selector: row => format(new Date(row.OrderDate), 'dd/MM/yyyy'),
	},
	{
		name: 'Delivery Date',
		sortable:true,
		selector: row =>format(new Date(row.DeliveryDate), 'dd/MM/yyyy , H:mm'),
	},
	{
		name: 'Sale Amount',
		sortable:true,
		selector: (row) => (<span>${USDollar.format(row.SaleAmount)}</span>),
	},
	{
		name: 'Employee',
		sortable:true,
		selector: row => row.Employee,
	},
	{
		name: 'City',
		sortable:true,
		selector: row => row.CustomerStoreCity,
	},
	{
		name: 'Status',
		sortable:true,
		width: "180px!important",
		selector: row => row.Status,
		cell:(row) => (
			<Button className={`${row.Status} btnStatus`}>
				{row.Status == 'active' ? 'Active' : ''}
				{row.Status == 'inactive' ? 'Inactive' : ''}
				{row.Status == 'stopwork' ? 'Stop Work' : ''}
			</Button>
		),	
	},
	{
		name: 'Action',
		selector: 'Action',
		cell:(row) => (
			<div className='zone-btnAction'>
				<Button className={`${row.Status === 'active' ? 'disabledStatus' : ''}`} onClick={() => actionStatus('A',row.ID)} variant="success">A</Button>
				<Button className={`${row.Status === 'inactive' ? 'disabledStatus' : ''}`} onClick={() => actionStatus('I',row.ID)} variant="warning">I</Button>
				<Button className={`${row.Status === 'stopwork' ? 'disabledStatus' : ''}`} onClick={() => actionStatus('D',row.ID)} variant="danger">S</Button>
			</div>
		),
	}
	)
	const onSumbitResult = (e) =>{
		e.preventDefault();
		let valueFromFilter = JSON.parse(localStorage.getItem('item'));
		const resultFilter = arr.filter((value) => {
			if (orderNumber) {
				if (orderNumber && valueEmployee && valueCity && valueStatus) {
					return value.OrderNumber === Number(orderNumber) 
					&& value.Employee === valueEmployee
					&& value.CustomerStoreCity === valueCity
					&& value.Status === valueStatus
				}
				else if (orderNumber && valueEmployee && valueCity) {
					return value.OrderNumber === Number(orderNumber) 
					&& value.Employee === valueEmployee
					&& value.CustomerStoreCity === valueCity
				}
				else if (orderNumber && valueEmployee && valueStatus) {
					return value.OrderNumber === Number(orderNumber) 
					&& value.Employee === valueEmployee
					&& value.Status === valueStatus
				}
				else if (orderNumber && valueCity && valueStatus) {
					return value.OrderNumber === Number(orderNumber) 
					&& value.CustomerStoreCity === valueCity
					&& value.Status === valueStatus
				}
				else if (orderNumber && valueEmployee) {
					return value.OrderNumber === Number(orderNumber) 
					&& value.Employee === valueEmployee
				}
				else if (orderNumber && valueCity) {
					return value.OrderNumber === Number(orderNumber) 
					&& value.CustomerStoreCity === valueCity
				}
				else if (orderNumber && valueStatus) {
					return value.OrderNumber === Number(orderNumber) 
					&& value.Status === valueStatus
				}
				else if (orderNumber) {
					return value.OrderNumber === Number(orderNumber) 
				}
			}
			else{
				if (valueEmployee && valueCity && valueStatus) {
					return (value.Employee === valueEmployee) && (value.CustomerStoreCity === valueCity) && (value.Status === valueStatus)
				}
				else if (valueEmployee && valueStatus) {
					return (value.Employee === valueEmployee) && (value.Status === valueStatus)
				}
				else if (valueCity && valueStatus) {
					return (value.CustomerStoreCity === valueCity) && (value.Status === valueStatus)
				}
				else if (valueEmployee && valueCity) {
					return (value.Employee === valueEmployee) && (value.CustomerStoreCity === valueCity);
				}
				else if (valueEmployee) {
					return value.Employee === valueEmployee
				}
				else if (valueCity) {
					return value.CustomerStoreCity === valueCity
				}
				else if (valueStatus) {
					return value.Status === valueStatus
				}
			}
		})
		resultFilter.forEach((element) =>{
			arrFilter.push(element)
		});
		localStorage.setItem('item',JSON.stringify(resultFilter))
		setShowDataTable(resultFilter);
	}
	const actionStatus = (status,id) =>{
		let valueFromFilter = JSON.parse(localStorage.getItem('item'));
		const valueOrderNumber = document.getElementById('order_number').value;
		const valueStatusForm = document.getElementById('formGridStatus').value;
		const valueEmployeeForm = document.getElementById('formGridEmployee').value;
		const valueCityForm = document.getElementById('formGridCity').value;
		
		if (valueOrderNumber || valueStatusForm || valueEmployeeForm || valueCityForm) {
			const result = valueFromFilter.filter((value) => {
				if (value.ID === id) {
					if (status == 'A') {
						value.Status = "active"
					}
					else if (status == 'I') {
						value.Status = "inactive"
					}
					else{
						value.Status = "stopwork"
					}
					return value
				}
			})
			const resultNoUse = valueFromFilter.filter((value) => {
				if (value.ID !== id) {
					return value
				}
			})
			resultNoUse.map((value) => {
				result.push(value)
			})
			result.sort(function(a, b) { 
				return a.ID - b.ID;
			  });
			localStorage.setItem('item',JSON.stringify(result))
			setShowDataTable(result)
		}
		else{
			if (status == 'A') {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i].ID === id) {
						arr[i].Status = "active";
					  break;
					}
				}
			}else if (status == 'I') {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i].ID === id) {
						arr[i].Status = "inactive";
					  break;
					}
				}
			}else{
				for (var i = 0; i < arr.length; i++) {
					if (arr[i].ID === id) {
						arr[i].Status = "stopwork";
					  break;
					}
				}
			}
			localStorage.setItem('item',JSON.stringify(arr))
			setShowDataTable(arr)
			setActiveStatus(true)
		}
	}
	let arr2 = []
	const clearForm = () =>{
		setOrderNumber('');
		setValueEmployee('');
		setValueCity('');
		setValueStatus('');
		setDisabled(true)
		data = []
		let valueClearForm = JSON.parse(localStorage.getItem('item'));

		arr.map((value) => {
			data.push({
				ID:value.ID,
				Status:value.Status,
				OrderNumber:value.OrderNumber,
				OrderDate:value.OrderDate,
				DeliveryDate:value.DeliveryDate,
				SaleAmount:value.SaleAmount,
				Employee:value.Employee,
				CustomerStoreCity:value.CustomerStoreCity,
			})
		})
		const sasas = valueClearForm.reduce((a,{ID}) => a.add(ID), new Set())
		const result = data.filter(({ID}) => !sasas.has(ID));
		valueClearForm.forEach((value) => {
			result.push(value)
		})
		result.sort(function(a, b) { 
			return a.ID - b.ID;
		});
		setAlertError(false);
		setSelected(true)
		localStorage.setItem('item',JSON.stringify(result))
		setShowDataTable(result);
	}
	const handleSelectEmployee = (e) =>{
		if (e.target.value) {
			setDisabled(false)
		}
		setSelected(false)
		setValueEmployee(e.target.value);
	}
	const handleSelectCity = (e) =>{
		if (e.target.value) {
			setDisabled(false)
		}
		setValueCity(e.target.value)
	}
	const handleSelectStatus = (e) =>{
		if (e.target.value) {
			setDisabled(false)
		}
		setValueStatus(e.target.value)
	}
	const handleOrderNumber = (e) =>{
		if (e.target.value) {
			setDisabled(false)
		}
		setOrderNumber(e.target.value);
	}
	
	useEffect(() =>{
		setColumnsTable(columns)
		setShowDataTable(data)
		setActiveStatus(false)
	},[activeStatus])


	return (
		<div className="page1">
			<Container>
				<div className='zone-search'>
					<div className='header-name'>
						SEARCH
					</div>
					<div className='zone-form'>
						<Form onSubmit={onSumbitResult}>
							<Row className="mb-3">
								<Form.Group as={Col} controlId="order_number">
									<Form.Label>Invoice Number</Form.Label>
									<Form.Control 
									minLength={5} 
									maxLength={6}
									type="number" 
									onChange={handleOrderNumber} 
									value={orderNumber} 
									placeholder="Enter number" 
									/>
								</Form.Group>

								<Form.Group as={Col} controlId="formGridStatus" onChange={handleSelectStatus}>
									<Form.Label>Status</Form.Label>
									<Form.Select defaultValue="Please select status">
										<option value="" selected={selected}>Please select status</option>
										<option value="active">Active</option>
										<option value="inactive">Inactive</option>
										<option value="stopwork">Stop Work</option>
									</Form.Select>
								</Form.Group>
							</Row>

							<Row className="mb-3">
								<Col xs={6}>
									<Form.Group as={Col} controlId="formGridEmployee" onChange={handleSelectEmployee}>
										<Form.Label>Employee</Form.Label>
										<Form.Select defaultValue="Please select employee" >
											<option value="" selected={selected}>Please select employee</option>
											{filterArrayOption.map((value, index) => 
											<option key={index} value={value} >{value}</option>
											)}
										</Form.Select>
									</Form.Group>
								</Col>
								<Col xs={6} className='d-flex align-items-center justify-content-center'>
										{/* <span>
											{alertError === true ? 
												'ไม่พบข้อมูลที่ค้นหา'
												:
												''
											}
										</span> */}
								</Col>
							</Row>
							<Row className="mb-3">
								<Col xs={6}>
									<Form.Group as={Col} controlId="formGridCity" onChange={handleSelectCity}>
										<Form.Label>City</Form.Label>
										<Form.Select defaultValue="Please select city" >
											<option value="" selected={selected}>Please select city</option>
											{filterArrayCity.map((value, index) => <option key={index} value={value} >{value}</option>)}
										</Form.Select>
									</Form.Group>
								</Col>
								<Col xs={6}>
								</Col>
							</Row>

							<div className='zone-btnForm'>
								<Button variant="danger" type="button" onClick={clearForm}>
									<img src={imgClear} alt="" />
								</Button>
								<Button variant="success" type="submit" disabled={disabled} className='btnSubmit'>
									<img src={imgSearch} alt="" />
								</Button>
							</div>				
						</Form>
					</div>
				</div>
				<div className='zone-result-search'>
					<div className='header-name'>
						SEARCH RESULT 
					</div>
					<div className='zone-table'>
						<DataTable 
						columns={columnsTable} 
						data={showDataTable}
						theme='solarized'
						customStyles={customStyles}
						pagination
						/>
						
					</div>	
				</div>
			</Container>
		</div>
	);
}

export default OrderSearch;
