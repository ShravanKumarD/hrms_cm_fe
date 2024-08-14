    <div
    ref={slipRef}
    style={{
      padding: "10px",
      fontFamily: "Arial, sans-serif",
      lineHeight: "1.6",
      width: "80%",
      margin: "20px auto",
      padding: "20px",
      border: "1px solid #000",
      backgroundImage: `url(${'https://samcintsolutions.in/wp-content/uploads/2024/01/rsz_1samcint_page-0001-removebg-preview-120x31.png'})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "contain",
    }}
  >
    <img
      style={{ height: "40px", width: "150px" }}
      src={img}
      alt="Company Logo"
    />
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <h1
      style={{
        textAlign: "center",
        color: "#EB7301",
        fontSize: "22px",
      }}
    >
      <strong>Offer Letter</strong>
    </h1>
    <p>&nbsp;</p>
    <p>Date: {todaysDate} </p>
    <p> {user.fullName}</p>
    <p>{place}</p>
    <p>
      Dear {user.fullName}, we are delighted to extend an offer to you for the
      position of <strong>{position}</strong> at CreditMitra. After carefully
      considering your qualifications and interview performance, we believe
      that your skills, enthusiasm, and potential will greatly contribute to
      our team and provide you with valuable learning opportunities.
    </p>
    <h4 style={{ fontSize: "16px" }}>
      <strong>Position Details</strong>
    </h4>
    <p>
      <strong>Position: </strong> {position}
    </p>
    <p>
      <strong>Department: </strong> {department}
    </p>
    <p>
      <strong>Salary: </strong>
      {stipend}
    </p>
    <p>
      <strong>Start Date: </strong>
      {startDate}
    </p>
    <p>
      <strong>Work Schedule:</strong> 9:30 am to 6:30 pm, Monday to Friday
    </p>
    <p>
      <strong>Location:</strong> Hyderabad
    </p>
    <p>
      Our team at CreditMitra is looking forward to having you work with us.
      During your internship, the concentration will be on helping you
      understand the theoretical concepts with their practicality and
      implications to help you connect your classroom knowledge and on-field
      experience. We will be happy to train you to learn new skills which are
      extremely helpful in the professional setting.
    </p>
    <p>
      Once again, congratulations to you on your selection and all the best
      for your endeavors.
    </p>
    <p>&nbsp;</p>
    <p>Regards,</p>
    <p>{hrName}</p>
    <p>{sender_title}</p>
    <p>Samcint solutions pvt. ltd.</p>
  
    {/* Black Bottom Section */}
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        // padding: "20px",
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "20px", // Add some space above the bottom section
      }}
    >
      <p style={{textAlign:"center"}}>Address – 4th Floor, B-Wing , Purva Summit, White field Road, Hitec city , Kondapur, Telangana- 500081</p>
    </div>
  </div>