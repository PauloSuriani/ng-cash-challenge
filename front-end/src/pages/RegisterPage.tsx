import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { api_url } from '../serverurl';

type LoginObject = {
	username?: string;
	password?: string;
}

export function RegisterPage() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [logged, setLogin] = useState(false);

	const navigate = useNavigate();
	const BASE_URL = api_url();

	useEffect(() => {
		const user = localStorage.getItem('user');

		if (!user) return setLogin(false);
		else if (JSON.parse(user).token) return setLogin(true);
	}, [logged, setLogin]);

	function handleAccessBtnClick() {
		const loginObj: LoginObject = {
			username,
			password,
		}
		const jsonObject = JSON.stringify(loginObj);

		fetch(`${BASE_URL}/register`, {
			method: "POST",
			headers: { 'Content-Type': 'application/json', 'Acept': '*/*' },
			body: jsonObject
		})
			.then(response => response.json())
			.then(res => {
				if (res['details'] != undefined) setMessage(res.details[0].message);
				else if (typeof (res) != 'object' && res.includes('cadastrado')) setMessage(res);

				if (res['status'] != undefined) {
					if (res.status === '201') {
						setMessage('Usuário cadastrado com sucesso, você já pode fazer login');
						setTimeout(() => {
							navigate('/login');
						}, 2000);
					}
				}
			})
			.catch(err => {
				console.log(err.message, typeof (err.message));
				if (err.message.includes('Failed to fetch')) {
					setMessage('Ops, problemas no servidor!');
				}
			});
	}

	function updateInputValue(event: any) {
		const key: string = event.key;
		const value: string = event.target.value;
		const field: string = event.target.id;

		if (field === 'username') {
			setUsername(value);
		} else if (field === 'password') {
			setPassword(value);
		}

		if (key === 'Enter') {
			handleAccessBtnClick();
		}
	}

	return (
		<div>{
			logged ? navigate('/')
				:
				(<div className="NewCustommerForm" >

					<div className="div-svg-btn-fixed">
						<h2 style={{ fontFamily: 'monospace' }}>{`
							${message === ''
								? `Cadastre-se agora!`
								: message}`}
						</h2>
					</div>

					<div className="new-custommer-block padding-top-aux">
						<div className="custommer-form">
							<div className="table-custommer-form">
								<div>
									<div className="table-login-form">
										<div>
											<h3 className="typewriter-tex3">{
												message === ''
													? `É rápido!`
													: message}</h3>
											<h3 className="typewriter-text">{
												message === ''
													? `Escolha um nome de Usuário e Senha`
													: ``}
											</h3>
										</div>
										<svg className="typewriter-svg" viewBox="0 0 20 20">
											<path d="M8.749,9.934c0,0.247-0.202,0.449-0.449,0.449H4.257c-0.247,0-0.449-0.202-0.449-0.449S4.01,9.484,4.257,9.484H8.3C8.547,9.484,8.749,9.687,8.749,9.934 M7.402,12.627H4.257c-0.247,0-0.449,0.202-0.449,0.449s0.202,0.449,0.449,0.449h3.145c0.247,0,0.449-0.202,0.449-0.449S7.648,12.627,7.402,12.627 M8.3,6.339H4.257c-0.247,0-0.449,0.202-0.449,0.449c0,0.247,0.202,0.449,0.449,0.449H8.3c0.247,0,0.449-0.202,0.449-0.449C8.749,6.541,8.547,6.339,8.3,6.339 M18.631,4.543v10.78c0,0.248-0.202,0.45-0.449,0.45H2.011c-0.247,0-0.449-0.202-0.449-0.45V4.543c0-0.247,0.202-0.449,0.449-0.449h16.17C18.429,4.094,18.631,4.296,18.631,4.543 M17.732,4.993H2.46v9.882h15.272V4.993z M16.371,13.078c0,0.247-0.202,0.449-0.449,0.449H9.646c-0.247,0-0.449-0.202-0.449-0.449c0-1.479,0.883-2.747,2.162-3.299c-0.434-0.418-0.714-1.008-0.714-1.642c0-1.197,0.997-2.246,2.133-2.246s2.134,1.049,2.134,2.246c0,0.634-0.28,1.224-0.714,1.642C15.475,10.331,16.371,11.6,16.371,13.078M11.542,8.137c0,0.622,0.539,1.348,1.235,1.348s1.235-0.726,1.235-1.348c0-0.622-0.539-1.348-1.235-1.348S11.542,7.515,11.542,8.137 M15.435,12.629c-0.214-1.273-1.323-2.246-2.657-2.246s-2.431,0.973-2.644,2.246H15.435z"></path>
										</svg>
									</div>
									<label className="form-label">Usuário</label>
									<input className="form-input-login" size={26} onKeyDown={evt => updateInputValue(evt)} type="text" value={username} id="username" onChange={evt => updateInputValue(evt)} />
									<label className="form-label">Senha</label>
									<input size={26} onKeyDown={evt => updateInputValue(evt)} className="form-input-login" type="password" value={password} id="password" onChange={evt => updateInputValue(evt)} />
								</div>
							</div>
						</div>

						<div className="div-svg-btn">
							<svg className="svg-nav-style" onClick={() => { navigate('/') }} viewBox="0 0 20 20">
								<path d="M11.739,13.962c-0.087,0.086-0.199,0.131-0.312,0.131c-0.112,0-0.226-0.045-0.312-0.131l-3.738-3.736c-0.173-0.173-0.173-0.454,0-0.626l3.559-3.562c0.173-0.175,0.454-0.173,0.626,0c0.173,0.172,0.173,0.451,0,0.624l-3.248,3.25l3.425,3.426C11.911,13.511,11.911,13.789,11.739,13.962 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.148,3.374,7.521,7.521,7.521C14.147,17.521,17.521,14.148,17.521,10"></path>
							</svg>
							<svg className="svg-nav-style" onClick={handleAccessBtnClick} viewBox="0 0 20 20">
								<path d="M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10"></path>
							</svg>
						</div>

					</div>
				</div>)}
		</div>
	);
}
