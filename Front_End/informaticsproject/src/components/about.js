import React from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";

export default function About() {
  return (
    <>
      
      <Layout>
      {/* Start Hero Section */}
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>Quick Cart Creators </h1>
                
                
              </div>
            </div>
           
          </div>
        </div>
      </div>
      {/* End Hero Section */}

      {/* Start Why Choose Us Section */}
      <div className="why-choose-section">
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-lg-6">
              <h2 className="section-title">Why Choose Boost Products for your fitness journey ?</h2>
              <p>
              Whether you are looking to build muscle, gain strength or lose weight, the protein in Boost products is the fuel your body needs. It keeps your metabolism firing, your muscles singing and you feeling in great shape.
              </p>

              <div className="row my-5">
                <div className="col-6 col-md-6">
                  <div className="feature">
                    <div className="icon">
                      <img
                        src="images/sugar.png"
                        height= "50px" width="50px"
                        alt="Sugar free products"
                        className="img-fluid"
                      />
                    </div>
                    <h3>Sugar Free </h3>
                    <p>
                      Products are sweetened with stevia.
                    </p>
                  </div>
                </div>

                <div className="col-6 col-md-6">
                  <div className="feature">
                    <div className="icon">
                      <img
                        src="images/recycled.jpg"
                        alt="Recycled materials"
                        height= "40px" width="40px"
                        className="img-fluid"
                      />
                    </div>
                    <h3>Plastic Free</h3>
                    <p>
                    Packaging canisters are made from 90% recycled cardboard.
                    </p>
                  </div>
                </div>

                <div className="col-6 col-md-6">
                  <div className="feature">
                    <div className="icon">
                      <img
                        src="images/muscle1.png"
                        alt="24/7 Support"
                        height= "40px" width="40px"
                        className="img-fluid"
                      />
                    </div>
                    <h3>Lean Muscle tone </h3>
                    <p>
                    Protein consumption coupled with resistance training stimulates the process of new muscle protein synthesis (MPS). Supplementing your daily protein requirements with Boost protein powder will not only make it easier to build and maintain lean muscle mass but increase overall resting metabolic rate assisting with fat loss. 
                    </p>
                  </div>
                </div>

                <div className="col-6 col-md-6">
                  <div className="feature">
                    <div className="icon">
                      <img
                        src="images/energy1.jpg"
                        alt="Energy"
                        height= "50px" width="40px"
                        className="img-fluid"
                      />
                    </div>
                    <h3>Exercise Recovery</h3>
                    <p>
                    Fast absorbing nutrients work quickly to kickstart protein synthesis by replenishing muscle fibres and reducing muscle fatigue and soreness. A high protein profile promotes nutrient absorption for improved muscle recovery and growth proven to take place 30 - 45 minutes prior to physical exercise.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="img-wrap">
                <img
                  src="images/running.jpg"
            
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Why Choose Us Section */}

      {/* Start Team Section */}
     
        <div className="container">
          <div className="row mb-5">
            <div className="aboutUsParagraph">

              <h2 className="title">Our Team</h2>
              <p className="mb-4">
                We are a team of individuals who are passionate about technology. We knew each other beforehand and recognised each other's strong work ethic and work dynamic towards our academics. This mutual respect for our commitment to schoolwork inspired us to partner up and leverage our diverse skills in this informatics second-year project.
                </p>
            </div>
          </div>
          
          </div>
          </Layout>
          </>   
  )
  };
