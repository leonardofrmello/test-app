import React, { Component } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import { isEmpty } from 'lodash';
import {
	Container,
	ContainerScroll,
	ContainerWrapper,
	ContainerLoading,
	TextError,
} from '../../utils/style';
import Colors from '../../utils/colors';
import Header from '../../components/header';
import CardProducts from '../../components/cardProducts';
import ButtomProject from '../../components/buttom';

export default class ProductsScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
			isLoading: false,
			error: false,
			page: 1,
			finishRequest: false,
		};
	}

	componentWillMount() {
		this.callApi(this.state.page);
	}

	callApi = async page => {
		this.setState({ isLoading: true, page: page });

		await axios
			.get(`https://pacific-wave-51314.herokuapp.com/products?page=${page}&size=10`)
			.then(({ status, data }) => {
				if (status === 200) {
					this.setState(prevState => ({
						data: prevState.data.concat(data),
						isLoading: false,
					}));
				} else {
					this.setState({ finishRequest: true, isLoading: false });
				}
			})
			.catch(error => {
				this.setState({ isLoading: false, error: true });
			});
	};

	render() {
		const { navigate } = this.props.navigation;
		const { isLoading, data, finishRequest, error } = this.state;

		return (
			<Container testID={'productScreen'}>
				<Header name="Lista de produtos" />

				{error && <TextError>Ocorreu um erro ao carregar!! Tente novamente mais tarde</TextError>}
				{isLoading && (
					<ContainerLoading>
						<ActivityIndicator size="large" color={Colors.orange} />
					</ContainerLoading>
				)}

				{!isEmpty(data) && !isLoading && (
					<ContainerScroll testID={'leo'}>
						<ContainerWrapper>
							<FlatList
								contentContainerStyle={{ flexGrow: 1 }}
								data={data}
								refreshing={true}
								keyExtractor={(item, index) => index.toString()}
								removeClippedSubviews={true}
								renderItem={({ item, index }) => {
									return <CardProducts data={item} navigate={navigate} />;
								}}
							/>

							{!finishRequest && (
								<ButtomProject
									name="Carregar mais"
									onPress={() => {
										this.callApi(this.state.page + 1);
									}}
									background={Colors.orange}
								/>
							)}
						</ContainerWrapper>
					</ContainerScroll>
				)}
			</Container>
		);
	}
}
