import axios from 'axios'

//TYPES

export const CART_ADD_ITEM = 'CART_ADD_ITEM'
export const CART_CLEAR_ITEMS = 'CART_RESET'
export const CART_REMOVE_ITEM = 'CART_REMOVE_ITEM'
export const CART_SAVE_SHIPPING_ADDRESS = 'CART_SAVE_SHIPPING_ADDRESS'
export const CART_SAVE_PAYMENT_METHOD = 'CART_SAVE_PAYMENT_METHOD'

//REDUCERS

export const cartReducer = (state = { cartItems: [], shippingAddress: {} }, action) => {
	switch (action.type) {
		case CART_ADD_ITEM:
			const item = action.payload

			const existItem = state.cartItems.find(x => x.product === item.product)

			if (existItem) {
				return {
					...state,
					cartItems: state.cartItems.map(x =>
						x.product === existItem.product ? item : x
					),
				}
			} else {
				return {
					...state,
					cartItems: [...state.cartItems, item],
				}
			}
		case CART_REMOVE_ITEM:
			return {
				...state,
				cartItems: state.cartItems.filter(x => x.product !== action.payload),
			}
		case CART_SAVE_SHIPPING_ADDRESS:
			return {
				...state,
				shippingAddress: action.payload,
			}
		case CART_SAVE_PAYMENT_METHOD:
			return {
				...state,
				paymentMethod: action.payload,
			}
		case CART_CLEAR_ITEMS:
			return {
				...state,
				cartItems: [],
			}
		default:
			return state
	}
}

//ACTIONS

export const addToCartAction = (id, qty) => async (dispatch, getState) => {
	const { data } = await axios.get(`/api/products/${id}`)

	dispatch({
		type: CART_ADD_ITEM,
		payload: {
			product: data._id,
			name: data.name,
			image: data.image,
			price: data.price,
			countInStock: data.countInStock,
			qty,
		},
	})

	localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeFromCartAction = id => (dispatch, getState) => {
	dispatch({
		type: CART_REMOVE_ITEM,
		payload: id,
	})

	localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const saveShippingAddressAction = data => dispatch => {
	dispatch({
		type: CART_SAVE_SHIPPING_ADDRESS,
		payload: data,
	})

	localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethodAction = data => dispatch => {
	dispatch({
		type: CART_SAVE_PAYMENT_METHOD,
		payload: data,
	})

	localStorage.setItem('paymentMethod', JSON.stringify(data))
}
