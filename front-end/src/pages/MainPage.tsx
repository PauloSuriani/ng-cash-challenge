import { useState, useEffect } from "react";
import { TransactionCard } from "../components/TransactionCard";
import { useNavigate } from 'react-router-dom';
import { api_url } from "../serverurl";


export function MainPage() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userBalance, setUserBalance] = useState();
	const [user, setUser] = useState();
	const [userId, setUserId] = useState(String);
	const [accountId, setAccountId] = useState(String);
	const [allTransactions, setAllTransactions] = useState([]);
	const [filteredTransactions, setFilteredTransactions] = useState([]);
	const [trUserName, setTrUserName] = useState<String>('');
	const [trValue, setTrValue] = useState();
	const [dialog, setDialog] = useState(String);

	const navigate = useNavigate();
	const BASE_URL = api_url();

	useEffect(() => {
		const storage = localStorage.getItem('user');

		if (!storage) return navigate('/login');

		if (JSON.parse(storage).token) {

			const token: string = JSON.parse(storage).token;

			fetch(`${BASE_URL}/validate`, {
				method: "GET",
				headers: { 'Authorization': token, 'Content-Type': 'application/json', 'Acept': '*/*' }
			})
				.then(response => response.json())
				.then(res => {
					if (res.status == 200) {
						setIsAuthenticated(true);
						setUserBalance(res.balance);
						setUser(res.username);
						setUserId(res.id);
						setAccountId(res.accountId)
						fetchTransactions(res.accountId);
					}
				})
				.catch(() => navigate('/login'));
		};
	}, [navigate]);

	function fetchTransactions(id: any) {
		const ob = { accountId: id };
		const jsonObject = JSON.stringify(ob)
		fetch(`${BASE_URL}/transactions`, {
			method: "POST",
			headers: { 'Content-Type': 'application/json', 'Acept': '*/*' },
			body: jsonObject
		})
			.then(response => response.json())
			.then(res => {
				setAllTransactions(res);
				setFilteredTransactions(res);
			})
			.catch(err => console.log(err));
	}

	function updateInputValue(event: any) {
		const value: any = event.target.value;
		const targetId: string = event.target.id;
		const filteredTransactions: [] = [];

		if (value == 'Cash-Out') {
			allTransactions.map(transaction => {
				if (userId == transaction['debitedAccountId']) {
					filteredTransactions.push(transaction);
				}
			})
		} else if (value == 'Mostrar Todos') {
			allTransactions.map(transaction => {
				filteredTransactions.push(transaction);
			})
		} else if (value == 'Cash-In') {
			allTransactions.map(transaction => {
				if (userId == transaction['creditedAccountId']) {
					filteredTransactions.push(transaction);
				}
			})
		} else if (targetId == 'createdAt') {
			allTransactions.map(transaction => {
				if (transaction['createdAt'] > value) {
					filteredTransactions.push(transaction);
				}
			})
		}

		setFilteredTransactions(filteredTransactions);
	}


	function handleInputTransaction(event: any) {
		let value: any = event.target.value;
		const targetId: string = event.target.id;

		if (targetId == 'tr-username-input') {
			setTrUserName(value);
		} else if (targetId == 'tr-value-input') {
			if (value.includes(',')) {
				value = value.replace(/,/g, '.');
			}
			value = parseFloat(value);
			setTrValue(value);
		}

		setFilteredTransactions(filteredTransactions);
	}

	// TRANSACTION ATEMPT
	function makeTransaction() {
		if (trValue && userBalance) {
			if (trUserName === '') {
				setDialog('Informe o username');
			} else if (trUserName === user) {
				setDialog('Você não pode transferir para si mesmo!');
			} else if (trValue <= userBalance) {
				const ob = { accountId, username: trUserName, value: trValue };
				const jsonObject = JSON.stringify(ob)
				fetch(`${BASE_URL}/operation`, {
					method: "POST",
					headers: { 'Content-Type': 'application/json', 'Acept': '*/*' },
					body: jsonObject
				})
					.then(response => response.json())
					.then(res => {
						if (typeof (res) != 'object' && res.includes('encontrado')) setDialog(res);

						if (res.status == 201) {
							setDialog('Operação realizada com succeso');
							setTimeout(() => {
								window.location.reload();
							}, 2000);
						}
					})
					.catch(err => console.log(err));

			}
			else {
				setDialog('Saldo insuficiente');
			}
		} else {
			setDialog('É preciso informar um valor para cash-out');
		}
	}

	return (
		isAuthenticated ?
			<div style={{ backgroundColor: 'white', fontFamily: 'monospace' }} className="MainPage">

				<div className="">

					<h1>
						<svg className="svg-nav-style-h1" onClick={() => { localStorage.removeItem('user'); location.reload(); }} viewBox="0 0 20 20">
							<path d="M3.24,7.51c-0.146,0.142-0.146,0.381,0,0.523l5.199,5.193c0.234,0.238,0.633,0.064,0.633-0.262v-2.634c0.105-0.007,0.212-0.011,0.321-0.011c2.373,0,4.302,1.91,4.302,4.258c0,0.957-0.33,1.809-1.008,2.602c-0.259,0.307,0.084,0.762,0.451,0.572c2.336-1.195,3.73-3.408,3.73-5.924c0-3.741-3.103-6.783-6.916-6.783c-0.307,0-0.615,0.028-0.881,0.063V2.575c0-0.327-0.398-0.5-0.633-0.261L3.24,7.51 M4.027,7.771l4.301-4.3v2.073c0,0.232,0.21,0.409,0.441,0.366c0.298-0.056,0.746-0.123,1.184-0.123c3.402,0,6.172,2.709,6.172,6.041c0,1.695-0.718,3.24-1.979,4.352c0.193-0.51,0.293-1.045,0.293-1.602c0-2.76-2.266-5-5.046-5c-0.256,0-0.528,0.018-0.747,0.05C8.465,9.653,8.328,9.81,8.328,9.995v2.074L4.027,7.771z"></path>
						</svg>
						{dialog ? `${dialog}`
							: `Olá, ${user}!`}
					</h1>
				</div>

				{/* ÁREA DADOS - FILTRO E BALANCE  */}
				<div className="SearchBar" style={{ display: 'block' }}>

					<div style={{ display: 'flex', alignItems: 'center', fontSize: '24px' }}>
						<svg className="svg-big-style" viewBox="0 0 20 20">
							<path d="M17.283,5.549h-5.26V4.335c0-0.222-0.183-0.404-0.404-0.404H8.381c-0.222,0-0.404,0.182-0.404,0.404v1.214h-5.26c-0.223,0-0.405,0.182-0.405,0.405v9.71c0,0.223,0.182,0.405,0.405,0.405h14.566c0.223,0,0.404-0.183,0.404-0.405v-9.71C17.688,5.731,17.506,5.549,17.283,5.549 M8.786,4.74h2.428v0.809H8.786V4.74z M16.879,15.26H3.122v-4.046h5.665v1.201c0,0.223,0.182,0.404,0.405,0.404h1.618c0.222,0,0.405-0.182,0.405-0.404v-1.201h5.665V15.26z M9.595,9.583h0.81v2.428h-0.81V9.583zM16.879,10.405h-5.665V9.19c0-0.222-0.183-0.405-0.405-0.405H9.191c-0.223,0-0.405,0.183-0.405,0.405v1.215H3.122V6.358h13.757V10.405z"></path>
						</svg>
						<b><div >{`Seu saldo: R$${userBalance}`}</div></b>

					</div>
					<div style={{ paddingLeft: '5px', paddingTop: '14px' }}>
						<label className="form-label">Realizar Cash-Out</label>
					</div>
					<div style={{ display: 'flex', flexWrap: 'wrap' }}>
						<div style={{ paddingLeft: '5px' }}>
							<label className="form-label">Username</label>
							<input onChange={evt => handleInputTransaction(evt)} className="form-input" type="text" size={15} id="tr-username-input" />
						</div>
						<div style={{ paddingLeft: '5px' }}>
							<label className="form-label">Valor(R$)</label>
							<input onChange={evt => handleInputTransaction(evt)} placeholder="R$ 00,00" className="form-input" type="text" size={7} id="tr-value-input" />
						</div>
						<svg onClick={() => makeTransaction()} className="svg-cashout" viewBox="0 0 20 20">
							<path d="M12.522,10.4l-3.559,3.562c-0.172,0.173-0.451,0.176-0.625,0c-0.173-0.173-0.173-0.451,0-0.624l3.248-3.25L8.161,6.662c-0.173-0.173-0.173-0.452,0-0.624c0.172-0.175,0.451-0.175,0.624,0l3.738,3.736C12.695,9.947,12.695,10.228,12.522,10.4 M18.406,10c0,4.644-3.764,8.406-8.406,8.406c-4.644,0-8.406-3.763-8.406-8.406S5.356,1.594,10,1.594C14.643,1.594,18.406,5.356,18.406,10M17.521,10c0-4.148-3.374-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.147,17.521,17.521,14.147,17.521,10"></path>
						</svg>
					</div>


					<div style={{ display: 'flex', paddingTop: '22px' }}>
						<svg className="svg-big-style" viewBox="0 0 20 20">
							<path d="M8.627,7.885C8.499,8.388,7.873,8.101,8.13,8.177L4.12,7.143c-0.218-0.057-0.351-0.28-0.293-0.498c0.057-0.218,0.279-0.351,0.497-0.294l4.011,1.037C8.552,7.444,8.685,7.667,8.627,7.885 M8.334,10.123L4.323,9.086C4.105,9.031,3.883,9.162,3.826,9.38C3.769,9.598,3.901,9.82,4.12,9.877l4.01,1.037c-0.262-0.062,0.373,0.192,0.497-0.294C8.685,10.401,8.552,10.18,8.334,10.123 M7.131,12.507L4.323,11.78c-0.218-0.057-0.44,0.076-0.497,0.295c-0.057,0.218,0.075,0.439,0.293,0.495l2.809,0.726c-0.265-0.062,0.37,0.193,0.495-0.293C7.48,12.784,7.35,12.562,7.131,12.507M18.159,3.677v10.701c0,0.186-0.126,0.348-0.306,0.393l-7.755,1.948c-0.07,0.016-0.134,0.016-0.204,0l-7.748-1.948c-0.179-0.045-0.306-0.207-0.306-0.393V3.677c0-0.267,0.249-0.461,0.509-0.396l7.646,1.921l7.654-1.921C17.91,3.216,18.159,3.41,18.159,3.677 M9.589,5.939L2.656,4.203v9.857l6.933,1.737V5.939z M17.344,4.203l-6.939,1.736v9.859l6.939-1.737V4.203z M16.168,6.645c-0.058-0.218-0.279-0.351-0.498-0.294l-4.011,1.037c-0.218,0.057-0.351,0.28-0.293,0.498c0.128,0.503,0.755,0.216,0.498,0.292l4.009-1.034C16.092,7.085,16.225,6.863,16.168,6.645 M16.168,9.38c-0.058-0.218-0.279-0.349-0.498-0.294l-4.011,1.036c-0.218,0.057-0.351,0.279-0.293,0.498c0.124,0.486,0.759,0.232,0.498,0.294l4.009-1.037C16.092,9.82,16.225,9.598,16.168,9.38 M14.963,12.385c-0.055-0.219-0.276-0.35-0.495-0.294l-2.809,0.726c-0.218,0.056-0.351,0.279-0.293,0.496c0.127,0.506,0.755,0.218,0.498,0.293l2.807-0.723C14.89,12.825,15.021,12.603,14.963,12.385"></path>
						</svg>
						<div style={{ paddingLeft: '5px', paddingTop: '12px' }}>
							<label className="form-lb">Histórico de Transfências</label>
						</div>
					</div>

					<div style={{ display: 'flex', flexWrap: 'wrap' }}>
						<div style={{ paddingLeft: '5px' }}>
							<label className="form-label">Data Inicial</label>
							<input onChange={evt => updateInputValue(evt)} className="form-input" type="date" id="createdAt" />
						</div>
						<div style={{ paddingLeft: '5px' }}>
							<label className="form-label">Por Tipo</label>
							<select onChange={evt => updateInputValue(evt)} className="form-l">
								<option>Mostrar Todos</option>
								<option id="credito">Cash-In</option>
								<option id="debito">Cash-Out</option>
							</select>
						</div>
						<svg className="svg-search" viewBox="0 0 20 20">
							<path d="M18.125,15.804l-4.038-4.037c0.675-1.079,1.012-2.308,1.01-3.534C15.089,4.62,12.199,1.75,8.584,1.75C4.815,1.75,1.982,4.726,2,8.286c0.021,3.577,2.908,6.549,6.578,6.549c1.241,0,2.417-0.347,3.44-0.985l4.032,4.026c0.167,0.166,0.43,0.166,0.596,0l1.479-1.478C18.292,16.234,18.292,15.968,18.125,15.804 M8.578,13.99c-3.198,0-5.716-2.593-5.733-5.71c-0.017-3.084,2.438-5.686,5.74-5.686c3.197,0,5.625,2.493,5.64,5.624C14.242,11.548,11.621,13.99,8.578,13.99 M16.349,16.981l-3.637-3.635c0.131-0.11,0.721-0.695,0.876-0.884l3.642,3.639L16.349,16.981z"></path>
						</svg>
					</div>
				</div>

				{/* ROLL DE OPERAÇÕESCARDS POR ACCOUNT ID:  */}
				<div className="custommer-card-roll">
					{filteredTransactions.map((transact) => {
						return (
							<div id={`transact-id-${transact['id']}`} className="custommer-card-style" key={`transact-id-${transact['id']}`}>
								{TransactionCard(transact, userId)}
							</div>
						)
					})
					}
				</div>
				<label className="label-footer">Desenvolvido por paulosuriani@gmail.com</label>

			</div>
			: <span/>
	);
}
