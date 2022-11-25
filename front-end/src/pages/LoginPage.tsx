import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { api_url } from '../serverurl';

type LoginObject = {
	username?: string;
	password?: string;
}

export function LoginPage() {
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
		
		fetch(`${BASE_URL}/login`, {
			method: "POST",
			headers: { 'Content-Type': 'application/json', 'Acept': '*/*' },
			body: jsonObject
		})
			.then(response => response.json())
			.then(res => {
				if (typeof (res) != 'object' && res.includes('cadastrado')) setMessage(res);
				if (typeof (res) != 'object' && res.includes('Incorreta')) setMessage(res);
				if (res.status == 200) {
					const { token, user } = res;
					localStorage.setItem('user', JSON.stringify({ token, ...user }));
					setMessage('Carregando seus dados...');
					setTimeout(() => {
						navigate('/');
					}, 2000);
				}
			})
			.catch(err => { console.log(err), setMessage(err.message) });
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
								? `Seu Banco Digital`
								: message}`}
						</h2>
					</div>

					<div className="new-custommer-block padding-top-aux">
						<div className="custommer-form">
							<div className="table-custommer-form">
								<div>
									<div className="table-login-form">
										<div>
											<h3 className="typewriter-tex2">Olá, visitante!</h3>
											<h3 className="typewriter-text">{
												message === ''
													? `Informe os seus dados abaixo`
													: message}
											</h3>
										</div>
										<svg className="typewriter-svg" >
											<image className="tag-image-svg" href="/money-svgrepo-com.svg" />
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
							<div style={{ paddingRight: '8px' }}>
								<svg className="svg-nav-style" onClick={() => { navigate('/register') }} viewBox="0 0 20 20">
									<path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
								</svg>
								<span className='label-foot'>Criar Conta</span>
							</div>

							<div style={{ paddingLeft: '8px' }}>
								<svg className="svg-nav-style" onClick={handleAccessBtnClick} viewBox="0 0 20 20">
									<path d="M12.522,10.4l-3.559,3.562c-0.172,0.173-0.451,0.176-0.625,0c-0.173-0.173-0.173-0.451,0-0.624l3.248-3.25L8.161,6.662c-0.173-0.173-0.173-0.452,0-0.624c0.172-0.175,0.451-0.175,0.624,0l3.738,3.736C12.695,9.947,12.695,10.228,12.522,10.4 M18.406,10c0,4.644-3.764,8.406-8.406,8.406c-4.644,0-8.406-3.763-8.406-8.406S5.356,1.594,10,1.594C14.643,1.594,18.406,5.356,18.406,10M17.521,10c0-4.148-3.374-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.147,17.521,17.521,14.147,17.521,10"></path>
								</svg>
								<span className='label-foot'>Fazer Login</span>
							</div>
						</div>

					</div>
				</div>)}
		</div>
	);
}
