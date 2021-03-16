import axios from 'axios'
import { logoutAction } from './userDuck'

//TYPES

export const PRODUCT_LIST_REQUEST = 'PRODUCT_LIST_REQUEST'
export const PRODUCT_LIST_SUCCESS = 'PRODUCT_LIST_SUCCESS'
export const PRODUCT_LIST_FAIL = 'PRODUCT_LIST_FAIL'

export const PRODUCT_DETAILS_REQUEST = 'PRODUCT_DETAILS_REQUEST'
export const PRODUCT_DETAILS_SUCCESS = 'PRODUCT_DETAILS_SUCCESS'
export const PRODUCT_DETAILS_FAIL = 'PRODUCT_DETAILS_FAIL'

export const PRODUCT_DELETE_REQUEST = 'PRODUCT_DELETE_REQUEST'
export const PRODUCT_DELETE_SUCCESS = 'PRODUCT_DELETE_SUCCESS'
export const PRODUCT_DELETE_FAIL = 'PRODUCT_DELETE_FAIL'

export const PRODUCT_CREATE_REQUEST = 'PRODUCT_CREATE_REQUEST'
export const PRODUCT_CREATE_SUCCESS = 'PRODUCT_CREATE_SUCCESS'
export const PRODUCT_CREATE_FAIL = 'PRODUCT_CREATE_FAIL'
export const PRODUCT_CREATE_RESET = 'PRODUCT_CREATE_RESET'

export const PRODUCT_UPDATE_REQUEST = 'PRODUCT_UPDATE_REQUEST'
export const PRODUCT_UPDATE_SUCCESS = 'PRODUCT_UPDATE_SUCCESS'
export const PRODUCT_UPDATE_FAIL = 'PRODUCT_UPDATE_FAIL'
export const PRODUCT_UPDATE_RESET = 'PRODUCT_UPDATE_RESET'

export const PRODUCT_CREATE_REVIEW_REQUEST = 'PRODUCT_CREATE_REVIEW_REQUEST'
export const PRODUCT_CREATE_REVIEW_SUCCESS = 'PRODUCT_CREATE_REVIEW_SUCCESS'
export const PRODUCT_CREATE_REVIEW_FAIL = 'PRODUCT_CREATE_REVIEW_FAIL'
export const PRODUCT_CREATE_REVIEW_RESET = 'PRODUCT_CREATE_REVIEW_RESET'

export const PRODUCT_TOP_REQUEST = 'PRODUCT_TOP_REQUEST'
export const PRODUCT_TOP_SUCCESS = 'PRODUCT_TOP_SUCCESS'
export const PRODUCT_TOP_FAIL = 'PRODUCT_TOP_FAIL'

//REDUCERS

export const productListReducer = (state = { products: [] }, action) => {
	switch (action.type) {
		case PRODUCT_LIST_REQUEST:
			return { loading: true, products: [] }
		case PRODUCT_LIST_SUCCESS:
			return {
				loading: false,
				products: action.payload.products,
				pages: action.payload.pages,
				page: action.payload.page,
			}
		case PRODUCT_LIST_FAIL:
			return { loading: false, error: action.payload }
		default:
			return state
	}
}

export const productDetailsReducer = (state = { product: { reviews: [] } }, action) => {
	switch (action.type) {
		case PRODUCT_DETAILS_REQUEST:
			return { ...state, loading: true }
		case PRODUCT_DETAILS_SUCCESS:
			return { loading: false, product: action.payload }
		case PRODUCT_DETAILS_FAIL:
			return { loading: false, error: action.payload }
		default:
			return state
	}
}

export const productDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case PRODUCT_DELETE_REQUEST:
			return { loading: true }
		case PRODUCT_DELETE_SUCCESS:
			return { loading: false, success: true }
		case PRODUCT_DELETE_FAIL:
			return { loading: false, error: action.payload }
		default:
			return state
	}
}

export const productCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case PRODUCT_CREATE_REQUEST:
			return { loading: true }
		case PRODUCT_CREATE_SUCCESS:
			return { loading: false, success: true, product: action.payload }
		case PRODUCT_CREATE_FAIL:
			return { loading: false, error: action.payload }
		case PRODUCT_CREATE_RESET:
			return {}
		default:
			return state
	}
}

export const productUpdateReducer = (state = { product: {} }, action) => {
	switch (action.type) {
		case PRODUCT_UPDATE_REQUEST:
			return { loading: true }
		case PRODUCT_UPDATE_SUCCESS:
			return { loading: false, success: true, product: action.payload }
		case PRODUCT_UPDATE_FAIL:
			return { loading: false, error: action.payload }
		case PRODUCT_UPDATE_RESET:
			return { product: {} }
		default:
			return state
	}
}

export const productReviewCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case PRODUCT_CREATE_REVIEW_REQUEST:
			return { loading: true }
		case PRODUCT_CREATE_REVIEW_SUCCESS:
			return { loading: false, success: true }
		case PRODUCT_CREATE_REVIEW_FAIL:
			return { loading: false, error: action.payload }
		case PRODUCT_CREATE_REVIEW_RESET:
			return {}
		default:
			return state
	}
}

export const productTopRatedReducer = (state = { products: [] }, action) => {
	switch (action.type) {
		case PRODUCT_TOP_REQUEST:
			return { loading: true, products: [] }
		case PRODUCT_TOP_SUCCESS:
			return { loading: false, products: action.payload }
		case PRODUCT_TOP_FAIL:
			return { loading: false, error: action.payload }
		default:
			return state
	}
}

//ACTIONS

export const listProductsAction = (keyword = '', pageNumber = '') => async dispatch => {
	try {
		dispatch({ type: PRODUCT_LIST_REQUEST })

		const { data } = await axios.get(
			`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
		)

		dispatch({
			type: PRODUCT_LIST_SUCCESS,
			payload: data,
		})
	} catch (error) {
		dispatch({
			type: PRODUCT_LIST_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const listProductDetailsAction = id => async dispatch => {
	try {
		dispatch({ type: PRODUCT_DETAILS_REQUEST })

		const { data } = await axios.get(`/api/products/${id}`)

		dispatch({
			type: PRODUCT_DETAILS_SUCCESS,
			payload: data,
		})
	} catch (error) {
		dispatch({
			type: PRODUCT_DETAILS_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}

export const deleteProductAction = id => async (dispatch, getState) => {
	try {
		dispatch({
			type: PRODUCT_DELETE_REQUEST,
		})

		const {
			userLogin: { userInfo },
		} = getState()

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		}

		await axios.delete(`/api/products/${id}`, config)

		dispatch({
			type: PRODUCT_DELETE_SUCCESS,
		})
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
		if (message === 'Not authorized, token failed') {
			dispatch(logoutAction())
		}
		dispatch({
			type: PRODUCT_DELETE_FAIL,
			payload: message,
		})
	}
}

export const createProductAction = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: PRODUCT_CREATE_REQUEST,
		})

		const {
			userLogin: { userInfo },
		} = getState()

		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		}

		const { data } = await axios.post(`/api/products`, {}, config)

		dispatch({
			type: PRODUCT_CREATE_SUCCESS,
			payload: data,
		})
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
		if (message === 'Not authorized, token failed') {
			dispatch(logoutAction())
		}
		dispatch({
			type: PRODUCT_CREATE_FAIL,
			payload: message,
		})
	}
}

export const updateProductAction = product => async (dispatch, getState) => {
	try {
		dispatch({
			type: PRODUCT_UPDATE_REQUEST,
		})

		const {
			userLogin: { userInfo },
		} = getState()

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		}

		const { data } = await axios.put(`/api/products/${product._id}`, product, config)

		dispatch({
			type: PRODUCT_UPDATE_SUCCESS,
			payload: data,
		})
		dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data })
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
		if (message === 'Not authorized, token failed') {
			dispatch(logoutAction())
		}
		dispatch({
			type: PRODUCT_UPDATE_FAIL,
			payload: message,
		})
	}
}

export const createProductReviewAction = (productId, review) => async (
	dispatch,
	getState
) => {
	try {
		dispatch({
			type: PRODUCT_CREATE_REVIEW_REQUEST,
		})

		const {
			userLogin: { userInfo },
		} = getState()

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		}

		await axios.post(`/api/products/${productId}/reviews`, review, config)

		dispatch({
			type: PRODUCT_CREATE_REVIEW_SUCCESS,
		})
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
		if (message === 'Not authorized, token failed') {
			dispatch(logoutAction())
		}
		dispatch({
			type: PRODUCT_CREATE_REVIEW_FAIL,
			payload: message,
		})
	}
}

export const listTopProductsAction = () => async dispatch => {
	try {
		dispatch({ type: PRODUCT_TOP_REQUEST })

		const { data } = await axios.get(`/api/products/top`)

		dispatch({
			type: PRODUCT_TOP_SUCCESS,
			payload: data,
		})
	} catch (error) {
		dispatch({
			type: PRODUCT_TOP_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}
