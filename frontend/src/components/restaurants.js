import React, { useState, useEffect, useContext } from "react";
import RestaurantDataService from "../services/restaurant";
import { UserContext } from '../App.js';

import { Link, useParams } from "react-router-dom";

function Restaurant(props) {

    const { id } = useParams();
    const { user, setUser } = useContext(UserContext);
    const initialRestaurantState = {
        id: null,
        name: "",
        address: {},
        cuisine: "",
        reviews: []
    };
    const [restaurant, setRestaurant] = useState(initialRestaurantState);

    const getRestaurant = id => {
        console.log(id)
        RestaurantDataService.get(id)
            .then(response => {
                setRestaurant(response.data);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    useEffect(() => {
        getRestaurant(id);
    }, [id]);

    const deleteReview = (reviewId, index) => {
        RestaurantDataService.deleteReview(reviewId, user.id)
            .then(response => {
                setRestaurant((prevState) => {
                    prevState.reviews.splice(index, 1)
                    return ({
                        ...prevState
                    })
                })
            })
            .catch(e => {
                console.log(e);
            });
    };

    return (
        <div>
            {restaurant ? (
                <div>
                    <h5>{restaurant.name}</h5>
                    <p>
                        <strong>Cuisine: </strong>{restaurant.cuisine}<br />
                        <strong>Address: </strong>{restaurant.address.building} {restaurant.address.street}, {restaurant.address.zipcode}
                    </p>
                    <Link to={"/restaurants/" + id + "/review"} className="btn btn-primary">
                        Add Review
                    </Link>
                    <h4> Reviews </h4>
                    <h5>{user == null ? 'Hello' : 'Bye'}</h5>
                    <div className="row">
                        {restaurant.reviews.length > 0 ? (
                            restaurant.reviews.map((review, index) => {
                                return (
                                    <div className="col-lg-4 pb-1" key={index}>
                                        <div className="card">
                                            <div className="card-body">
                                                <p className="card-text">
                                                    {review.text}<br />
                                                    <strong>User: </strong>{review.name}<br />
                                                    <strong>Date: </strong>{review.date}
                                                </p>
                                                {user && user.id === review.user_id &&
                                                    <div className="row">
                                                        <a onClick={() => deleteReview(review._id, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">Delete</a>
                                                        <Link to={"/restaurants/" + id + "/review"} state={{ currentReview: review }} className="btn btn-primary col-lg-5 mx-1 mb-1">Edit</Link>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-sm-4">
                                <p>No reviews yet.</p>
                            </div>
                        )}

                    </div>

                </div>
            ) : (
                <div>
                    <br />
                    <p>No restaurant selected.</p>
                </div>
            )}
        </div>
    );
};

export default Restaurant;