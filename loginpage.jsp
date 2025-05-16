<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="css/styles.css" />
	 <link rel="stylesheet" href="loginpage.css">
	
<title>Milktea-Login</title>
</head>
<body>
<div class="login-container">
    <img src="logo.png" alt="Capybara Icon" class="capy-img">
    <h2>Welcome to CapyBrew MilkTea</h2>
    <form name="loginForm" action="LoginServlet" method="post" onsubmit="return validateForm();">
        <input type="text" name="username" placeholder="Username" required /><br/>
        <input type="password" name="password" placeholder="Password" required /><br/>

        <div class="options-row">
            <label><input type="checkbox" name="remember" /> Remember me</label>
            <a href="#" class="forgot-password">Forgot Password?</a>
        </div>

        <input type="submit" value="Login" />

        <div class="signup-line">
            Not a member? <a href="signup.jsp" class="signup-link">Signup now</a>
        </div>
    </form>
    
    
    <div class="footer-text">
        ☕ Made with love by the Capybara Crew
    </div>
</div>

<script src="js/loginpage.js"></script>

</body>
</html>