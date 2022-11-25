type TransactionProps = {
	id: string;
	debitedAccountId?: string;
	creditedAccountId?: string;
	value?: string;
	createdAt?: string;
}

export function TransactionCard(props: TransactionProps, accountId: string) {

	function formateDateToDDMMYYYY(date: string) {
		const day = date.slice(8, 10);
		const month = date.slice(5, 7);
		const year = date.slice(0, 4);
		
		const formatedDate = day + '/' + (month) + '/' + year;

		return formatedDate;
	}

	return (
		<div className="CustommerCard">
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div>
					<div style={{ display: 'flex' }}>
						{
							accountId == props.debitedAccountId ?
								<div style={{ minWidth: '400px', display: 'flex', fontSize: '15px', paddingRight: '5px' }}>
									<b><label style={{ fontSize: '15px', paddingRight: '5px' }}>Tipo: Cash-Out</label></b>
									<div style={{ display: 'flex', paddingLeft: '10px' }}>
										<b><label style={{ fontSize: '15px', paddingRight: '5px' }}>Valor: </label></b>
										<div style={{}}>{`R$${(props.value)}`}</div>
									</div>
									<b><label style={{ fontSize: '15px', paddingLeft: '15px', paddingRight: '5px' }}>Id Destino: </label></b>
									<div>{props.creditedAccountId}</div>
								</div>
								:
								<div style={{ minWidth: '400px', display: 'flex', fontSize: '15px', paddingRight: '5px'}}>
									<b><label style={{ fontSize: '15px', paddingRight: '5px' }}>Tipo: Cash-In</label></b>
									<div style={{ display: 'flex', paddingLeft: '10px' }}>
										<b><label style={{ fontSize: '15px', paddingRight: '5px' }}>Valor: </label></b>
										<div style={{}}>{`RS${props.value}`}</div>
									</div>
									<b><label style={{ fontSize: '15px', paddingLeft: '15px', paddingRight: '5px' }}>Id Origem:</label></b>
									<div>{props.debitedAccountId}</div>
								</div>
						}
						<div style={{ display: 'flex', paddingLeft: '5px' }}>
							<b><label style={{ fontSize: '15px', paddingRight: '5px' }}>Data: </label></b>
							<div style={{fontSize: '15px', }}>{props.createdAt && formateDateToDDMMYYYY(props.createdAt)}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}