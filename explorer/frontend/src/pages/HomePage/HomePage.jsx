import {$t} from '../../i18n';
import {BlockService} from '../../services/BlockService';
import {timeSince, useApi} from '../../utils';
import React from 'react';
import {Card, Col, Container, Row, Spinner, Table} from 'react-bootstrap';
import {toast} from 'react-toastify';
import './HomePage.scss';

export const HomePage = () => {
	const [recentBlocks, isRecentBlocksLoading] = useApi(BlockService.getBlockList, [1], [], e => toast.error(e.message));

	return (
		<div className="home-page">
			<Container>
				<Row className="my-3">
					<Col>
						<Card>
							<Card.Header>
								<h3>Blocks</h3>
							</Card.Header>
							<Card.Body>
								{!isRecentBlocksLoading && <Table responsive hover size="sm">
									<thead>
										<tr>
											<th>Height</th>
											<th width={100}>Harvester</th>
											<th>Transactions</th>
											<th>Age</th>
										</tr>
									</thead>
									<tbody>
										{recentBlocks.map(block => (
											<tr key={'block' + block.height}>
												<td>{block.height}</td>
												<td width={100}>{block.harvester}</td>
												<td>{block.txes.length}</td>
												<td>{timeSince(block.timeStamp, $t)}</td>
											</tr>
										))}
									</tbody>
								</Table>}
								{isRecentBlocksLoading && <Spinner animation="border" variant="primary"/>}
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};
