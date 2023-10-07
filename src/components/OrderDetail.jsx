import '../styles/App.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import DataTable, { createTheme } from 'react-data-table-component';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import orders from '../service/orders.json'
import { format } from 'date-fns';
import GoogleMapReact from 'google-map-react';
import imgClear from '../styles/imgs/delete.png'
import bin from '../styles/imgs/recycle-bin.png'
import imgSave from '../styles/imgs/diskette.png'
import HarvMudd from '../styles/imgs/HarvMudd.jpg'
import JimPackard from '../styles/imgs/JimPackard.jpg'
import ToddHoffman from '../styles/imgs/ToddHoffman.jpg'
import ClarkMorgan from '../styles/imgs/ClarkMorgan.jpg'
import iconCorrect from '../styles/imgs/accept.png'
import iconCopy from '../styles/imgs/copy.png'
import iconPaste from '../styles/imgs/paste.png'
import iconDelete from '../styles/imgs/delete.png'
import 'devextreme/dist/css/dx.light.css';
import { TreeList, Editing, Column, RequiredRule, Lookup } from 'devextreme-react/tree-list';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ReactLoading from 'react-loading';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { TroubleshootSharp } from '@mui/icons-material';
function OrderDetail() {
	const order = orders.orders;
	const arr = []
	let data = []
	const listItemsEmployee = [];
	const listItemsCity = [];
	const [disabled , setDisabled] = useState(true)
	const [disabledDataMain , setDisabledDataMain] = useState(false)
	const [orderNumber , setOrderNumber] = useState('')
	const [valueCity , setValueCity] = useState()
	const [valueEmployee , setValueEmployee] = useState()
	const [selected , setSelected] = useState(false)
	const [valueStatus , setValueStatus] = useState()
	const [columnsTable , setColumnsTable] = useState()
	const [showDataTable , setShowDataTable] = useState()
	const [show, setShow] = useState(false);
	const [amountProducts, setAmountProducts] = useState(0);

	const handleClose = () => setShow(false);
	const { id } = useParams();
	let arrDataEmployee = []
	let USDollar = new Intl.NumberFormat('en-US', {
		currency: 'USD',
	});
	const renderTooltipCopy = (props) => (
		<Tooltip id="button-tooltipCopy" {...props}>
		  Copy
		</Tooltip>
	  );
	const renderTooltipPaste = (props) => (
		<Tooltip id="button-tooltipPaste" {...props}>
		  Paste
		</Tooltip>
	  );
	const renderTooltipDelete = (props) => (
		<Tooltip id="button-tooltipDelete" {...props}>
		  Delete
		</Tooltip>
	  );
	const copyDataAmonut = (amount) =>{
		localStorage.setItem('amount',amount);
	}
	const columns = []
	columns.push(
	
	{
		name: 'Invoice Number',
		selector: row => row.OrderNumber,
	},
	{
		name: 'Delivery Date',
		selector: row => format(new Date(row.DeliveryDate), 'dd/MM/yyyy , H:mm'),
		
	},
	{
		name: 'City',
		selector: row => row.CustomerStoreCity,
	},
	{
		name: 'Amount Products',
		selector: (row) => row.AmountProducts,
		
	},
	{
		name: 'Status',
		width: "150px!important",
		selector: row => row.Status,
		cell:(row) => (
			<Button className={`${row.Status} btnStatus btnStatusDetail`}>
				{row.Status == "active" || row.Status == "Active"  ? "A" : " "}
				{row.Status == "inactive" || row.Status == "Inactive" ? "I" : " "}
				{row.Status == "stopwork" || row.Status == "Stop Work" ? "S" : " "}
			</Button>
		),	
	},
	{
		name: 'Action',
		selector: 'Action',
		cell:(row) => (
			<div className='zone-btnAction'>
				<OverlayTrigger placement="bottom" delay={{ show: 250, hide: 300 }}	overlay={renderTooltipCopy}>
					<Button variant="secondary" onClick={() => copyDataAmonut(row.AmountProducts)}>
						<img src={iconCopy} alt="" style={{width:'100%'}}/>
					</Button>
				</OverlayTrigger>
				<OverlayTrigger placement="bottom" delay={{ show: 250, hide: 300 }}	overlay={renderTooltipPaste}>
					<Button variant="info" onClick={() => pasteDataAmount(row.OrderNumber)} >
						<img src={iconPaste} alt="" style={{width:'100%'}}/>
					</Button>
				</OverlayTrigger>
				<OverlayTrigger placement="bottom" delay={{ show: 250, hide: 300 }}	overlay={renderTooltipDelete}>
					<Button variant="danger" onClick={() => deleteRowData(row.ID,row.OrderNumber,row.Status)}>
						<img src={bin} alt="" style={{width:'100%'}}/>
					</Button>
				</OverlayTrigger>
			</div>
		),
	},
	)
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
			ImageEmployee:value.ImageEmployee,
			CustomerStoreCity:value.CustomerStoreCity,
			Latitude:value.Latitude,
            Longitude:value.Longitude,
			AmountProducts:value.AmountProducts
		})
	})

	let filterArrayOption = listItemsEmployee.filter(function(item, pos) {
		return listItemsEmployee.indexOf(item) == pos;
	})
	let filterArrayCity = listItemsCity.filter(function(item, pos) {
		return listItemsCity.indexOf(item) == pos;
	})

	const filterOrderNumber = arr.filter(function(item) {
		// filter order true
		return item.OrderNumber.toString() === id;
	})
	
	const showOrderDetail = () =>{
		filterOrderNumber.forEach((value) =>{
			setOrderNumber(value.OrderNumber);
			setValueCity(value.CustomerStoreCity)
			setValueEmployee(value.Employee)
			setValueStatus(value.Status)
		});
	}
	const handleOrderNumber = (e) =>{
		if (e.target.value) {
			setDisabled(false)
		}
		setOrderNumber(e.target.value)
	}
	const handleSelectCity = (e) =>{
		if (e.target.value) {
			setDisabled(false)
		}
		setValueCity(e.target.value)
	}
	const handleSelectEmployee = (e) =>{
		if (e.target.value) {
			setDisabled(false)
		}
		setSelected(false)
		setValueEmployee(e.target.value);
	}
	const handleSelectStatus = (e) =>{
		if (e.target.value) {
			setDisabled(false)
		}
		setValueStatus(e.target.value)
	}
	const dataNewSave = []
	const dataSaveUse = []
	const [isCorrect, setIsCorrect] = useState(false);
	const [isDelete, setIsDelete] = useState(false);
	const [isSave, setIsSave] = useState(false);
	const [dataDeleteUse ,setDataDeleteUse] = useState()

	const clearDataEdit = () =>{
		setValueCity('')
		setValueEmployee('')
		setValueStatus('')
	}
	const onSummitDataEdit = (e) =>{
		e.preventDefault();
		setShow(true)
		setTimeout(() => {
			setIsCorrect(true)
			setTimeout(() => {
				setShow(false)
				if (isDelete === false) {
					resultFilterOrder.filter((item) => {
						if (item.OrderNumber.toString() === id) {
							dataNewSave.push({ID:item.ID,
								Status:valueStatus,
								OrderNumber:item.OrderNumber,
								OrderDate:item.OrderDate,
								DeliveryDate:item.DeliveryDate,
								SaleAmount:item.SaleAmount,
								Employee:valueEmployee,
								ImageEmployee:item.ImageEmployee,
								CustomerStoreCity:valueCity,
								Latitude:item.Latitude,
								Longitude:item.Longitude,
								AmountProducts:item.AmountProducts
							})
						}
						else{
							dataNewSave.push({
								ID:item.ID,
								Status:item.Status,
								OrderNumber:item.OrderNumber,
								OrderDate:item.OrderDate,
								DeliveryDate:item.DeliveryDate,
								SaleAmount:item.SaleAmount,
								Employee:item.Employee,
								ImageEmployee:item.ImageEmployee,
								CustomerStoreCity:item.CustomerStoreCity,
								Latitude:item.Latitude,
								Longitude:item.Longitude,
								AmountProducts:item.AmountProducts
							})
						}
					})
				}else{
					dataDeleteUse.filter((item) => {
						if (item.OrderNumber.toString() === id) {
							dataNewSave.push({ID:item.ID,
								Status:valueStatus,
								OrderNumber:item.OrderNumber,
								OrderDate:item.OrderDate,
								DeliveryDate:item.DeliveryDate,
								SaleAmount:item.SaleAmount,
								Employee:valueEmployee,
								ImageEmployee:item.ImageEmployee,
								CustomerStoreCity:valueCity,
								Latitude:item.Latitude,
								Longitude:item.Longitude,
								AmountProducts:item.AmountProducts
							})
						}
						else{
							dataNewSave.push({
								ID:item.ID,
								Status:item.Status,
								OrderNumber:item.OrderNumber,
								OrderDate:item.OrderDate,
								DeliveryDate:item.DeliveryDate,
								SaleAmount:item.SaleAmount,
								Employee:item.Employee,
								ImageEmployee:item.ImageEmployee,
								CustomerStoreCity:item.CustomerStoreCity,
								Latitude:item.Latitude,
								Longitude:item.Longitude,
								AmountProducts:item.AmountProducts
							})
						}
					})
				}
				
				setShowDataTable(dataNewSave)
				setTimeout(() => {
					setIsCorrect(false)
				}, 500);
			}, 1500);
		}, 1500);
		setIsSave(true)
	}
	const deleteRowData = (id,number,status) =>{
		const getOrderNumber = document.getElementById('order_number').value
		const deleteData = newDataDelete.filter((item) => {
			return item.ID !== id;
		})
		if (number == getOrderNumber) {
			setOrderNumber('');
			setValueCity('')
			setValueEmployee('')
			setValueStatus('')
			setDisabledDataMain(true)
		}
		newDataDelete = []
		deleteData.forEach((value) => {
			newDataDelete.push(value)
		})
		setShowDataTable(deleteData);
		setDataDeleteUse(deleteData);
		setIsDelete(true)

		//treelist
		const dataTreeList = dataEmployee[0].children.filter((item) => {
			return item.invoiceNumber !== number;
		})
		dataEmployee[0].children = []
		for (let index = 0; index < dataTreeList.length; index++) {
			dataEmployee[0].children.push({
				id:index+1,
				invoiceNumber:dataTreeList[index].invoiceNumber,
				customerCity:dataTreeList[index].customerCity,
				deliveryDate:dataTreeList[index].deliveryDate,
			})
		}
		setDataInTree(dataEmployee)
		setToggleTree(true)
	}
	const resultFilterOrder = data.filter((order) => {
		// Employee true
		return order.Employee == filterOrderNumber[0].Employee;
	})
	localStorage.setItem('result',JSON.stringify(resultFilterOrder))

	const resultMapListOrder = resultFilterOrder.map((treeList ,index )=> {
		return treeList.OrderNumber
	})  
	const EmployeeName = []
	const InvocieNumber = []
	const CustomerCity = []
	const DelDate = []
	const [dataInTree , setDataInTree] = useState([])
	const [toggleTree , setToggleTree] = useState(false)
	const dataEmployee = []
	resultFilterOrder.forEach((element) =>{
		EmployeeName.push(element.Employee);
		InvocieNumber.push(element.OrderNumber);
		CustomerCity.push(element.CustomerStoreCity);
		DelDate.push(element.DeliveryDate);
	});
	let employeeName = EmployeeName.filter((item, pos) => {
		//ชื่อไม่ซ้ำ
		return EmployeeName.indexOf(item) == pos;
	})
	dataEmployee.push({
		id:'root',
		name:employeeName[0],
		children:[]
	})
	for (let index = 0; index < InvocieNumber.length; index++) {
		dataEmployee[0].children.push({
			id:index+1,
			invoiceNumber:InvocieNumber[index],
			customerCity:CustomerCity[index],
			deliveryDate:DelDate[index],
		})
	}
	let newDataDelete = []
	resultFilterOrder.forEach((value) => {
		newDataDelete.push(value)
	})

	let arrDataCopy = []
	const pasteDataAmount = (number) =>{
		let amount = Number(localStorage.getItem('amount'));
		let resultCopy = JSON.parse(localStorage.getItem('result'))
		arrDataCopy = [] 
		
		const result = resultCopy.filter((value)=>{
			if (value.OrderNumber == number) {
				value.AmountProducts = amount
				return value
			}
		})

		const resultNoUse = resultCopy.filter((value)=>{
			return value.OrderNumber !== number
		})
		resultNoUse.map((value) => {
			result.push(value)
		})

		result.sort(function(a, b) { 
			return a.ID - b.ID;
		});
		localStorage.setItem('result',JSON.stringify(result))
		setShowDataTable(resultCopy);
	}
	
	useEffect(() =>{
		showOrderDetail()
		setColumnsTable(columns)
		setShowDataTable(resultFilterOrder)
		setDataInTree(dataEmployee)
		localStorage.setItem('amount',0)
	},[])
	
	
	return (
		<div className="page2">
			<Container>
				<div className="zone-order">
					<div className='box-btnEdit'>
						<h3 className='mb-4'>ORDER DETAIL</h3>
						
					</div>
					<Row>
						<Col xs={6}>
							<div className='zone-treeList'>
								<div className='header-name'>
									ORDER TREELIST
								</div>
								<div className='zone-dateTreeList'>
									<p>EMPLOYEE</p>
									<TreeView
										aria-label="Employee and Order navigator"
										defaultCollapseIcon={<ExpandMoreIcon />}
										defaultExpandIcon={<ChevronRightIcon />}
										defaultExpanded={['root','-1']}
										>
											{dataInTree.map((treeItem,index) => (
												<TreeItem nodeId={treeItem.id} label={treeItem.name}>
													{
														dataInTree[0].children.map((treeItemInvoiceNumber,indexInvoiceNumber)=>(
															<TreeItem 
															className={treeItemInvoiceNumber.invoiceNumber == orderNumber ? 'activeNumber' : ''} 
															nodeId={treeItemInvoiceNumber.id} 
															label={`INVOICE NUMBER :${treeItemInvoiceNumber.invoiceNumber}`} >
																<TreeItem 
																nodeId={treeItemInvoiceNumber.customerCity} 
																label={`DELIVERY AT :${treeItemInvoiceNumber.customerCity}`} >
																</TreeItem>							
																<TreeItem 
																nodeId={treeItemInvoiceNumber.deliveryDate} 
																label={`DATE :${format(new Date(treeItemInvoiceNumber.deliveryDate), 'dd/MM/yyyy , H:mm')}`} >
																</TreeItem>							
															</TreeItem>
														))
													}
												</TreeItem>
											))}
									</TreeView>
								</div>
							</div>
						</Col>
						<Col xs={6}>
							<div className='zone-formDetail'>
								<div className='header-name'>
									SEARCH ORDER DETAIL
								</div>
								<div className='zone-enterFormDetail'>
								<Form onSubmit={onSummitDataEdit}>
									<Form.Group as={Col} controlId="order_number" className='mb-3'>
										<Form.Label>Invoice Number</Form.Label>
										<Form.Control className="inputBoxOrder" type="number" onChange={handleOrderNumber} value={orderNumber} placeholder="Enter number" disabled/>
									</Form.Group>

									<Form.Group controlId="formGridEmployee" className='mb-3' onChange={handleSelectEmployee}>
										<Form.Label>Employee</Form.Label>
										<Form.Select defaultValue="Please select employee" disabled={disabledDataMain} required>
											<option value="" selected={selected}>Please select employee</option>
											{filterArrayOption.map((value, index) => 
											<option key={index} selected={value == valueEmployee ? true : false} value={() => setValueEmployee(value)} >{value}</option>
											)}
										</Form.Select>
									</Form.Group>

									<Form.Group controlId="formGridCity" className='mb-3' onChange={handleSelectCity}>
										<Form.Label>City</Form.Label>
										<Form.Select defaultValue="Please select city" disabled={disabledDataMain} required>
											<option value="" selected={selected}>Please select city</option>
											{filterArrayCity.map((value, index) => 
											<option key={index} selected={value == valueCity ? true : false} value={() => setValueCity(value)} >{value}</option>
											)}
										</Form.Select>
									</Form.Group>

									<Form.Group controlId="formGridStatus" className='mb-3' onChange={handleSelectStatus}>
										<Form.Label>Status</Form.Label>
										<Form.Select defaultValue="Please select status" disabled={disabledDataMain} required>
											<option value="" >Please select status</option>
											<option selected={valueStatus == 'active' ? true : false} value="active">Active</option>
											<option selected={valueStatus == 'inactive' ? true : false} value="inactive">Inactive</option>
											<option selected={valueStatus == 'stopwork' ? true : false} value="stopwork">Stop Work</option>
											{/* () => setValueStatus("active") */}
										</Form.Select>
									</Form.Group>
									<div className='d-flex align-items-center justify-content-end'>
										<Button variant="danger" className='btnClearEdit' onClick={clearDataEdit}>
											<img src={imgClear} alt="" />
										</Button>
										<Button variant="success" className='btnSaveEdit' type='submit' disabled={disabledDataMain}>
											<img src={imgSave} alt="" />
										</Button>
									</div>
								</Form>					
								</div>
							</div>
						</Col>

						<Col xs={12}>
							<div className='zone-detailDelivery mt-4'>
								<div className='header-name'>
									ORDER DETAIL
								</div>
								<div className='zone-showDetail'>
									<Row>
										<Col xs={3} style={{paddingRight:'0rem'}}>
											<div className='zone-detail-employee'>
												<div>
													<div className='imgEmployeeDetail' style={{background:`url(${filterOrderNumber[0].ImageEmployee})`}}></div>
												</div>
												<div className='text-center mt-2'>
													{filterOrderNumber[0].Employee}
												</div>
											</div>
										</Col>			
										<Col xs={9} style={{paddingLeft:'0rem'}}>
											<DataTable 
											columns={columnsTable} 
											data={showDataTable}
											theme='solarized'
											customStyles={customStyles}
											pagination
											/>
										</Col>			
									</Row>
								</div>
							</div>
						</Col>
					</Row>
				</div>
				
			</Container>
			
			<Modal show={show} >
				<Modal.Header></Modal.Header>
				<Modal.Body>
					{isCorrect === true ?
						<div className='text-center'>
							<img src={iconCorrect} alt="" style={{width:'70px',height:'70px',margin:'auto'}}/>
							<p className='mt-3 mb-0'>Successfully edited</p>
						</div>
					:
						<div>
							<div className='d-flex align-items-center justify-content-center mb-3'>
								<ReactLoading type={'cylon'} color={'#FFF'} height={'50px'} width={'50px'}/>
							</div>
							<h4 className='text-center'>Saving data...</h4>
						</div>
					}
				</Modal.Body>
				<Modal.Footer></Modal.Footer>
			</Modal>
		</div>
	);
}

export default OrderDetail;
