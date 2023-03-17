import React, { useEffect, useState } from "react";
import CardCart from "../../components/CardCart/CardCart";
import ButtonCTA from "../../components/ButtonCTA/ButtonCTA";
import styles from "./Cart.module.css";
import { useSelector, useDispatch } from "react-redux";
import { postPayment } from "../../redux/actions/actions";
import useUser from "../../Hooks/useUser";
import { useLocation, useNavigate } from "react-router-dom";

export default function Cart({ id }) {

	const { isLogged, loginFromCart } = useUser();
	const navigate = useNavigate();
	const location = useLocation().pathname;

	const carritos = useSelector((state) => state.carritos);
	const sandbox = useSelector((state) => state.mercadoPago.sandbox);
	const [carrito, setCarrito] = useState({ ...carritos });
	const dispatch = useDispatch();
	useEffect(() => {
		if (carritos[id]) {
			setCarrito({ ...carritos[id] });
		}
	}, [carritos]);

	const idUser = window.localStorage.getItem('idUser');

	function handlerPostPayment() {
		dispatch(postPayment(id, "DiegoMaldonado", carrito))
	}

	useEffect(() => {
		if (!idUser) {
			window.localStorage.setItem('hrefcompra', location)
			navigate("/login")
		}
		else if (sandbox) {
			window.location.replace(sandbox);
		}
	}, [idUser, location, navigate, sandbox]);

	return (
		<div className={styles.cart}>
			<div className={styles.cart__header}>
				<h3>Tu pedido</h3>
			</div>
			<ul>
				{carrito.data &&
					carrito.data.map((x) => {
						return (
							<CardCart
								idProduct={x.id}
								idCommerce={id}
								key={x.name}
								name={x.name}
								cantidad={x.cantidad}
								precio={x.price}
								image={x.img}
							/>
						);
					})}
			</ul>
			<p className={styles.total__container}>
				Total: <span>${carrito?.total || 0}</span>
			</p>
			<div>
				<ButtonCTA fc={handlerPostPayment} />
			</div>
		</div>
	);
}