Feature: Login Page ValidationS

Scenario: @Smoke Verify the app loads the expected Cinco URL successfully
  Given the app URL is launched
  When the app page is loading
  Then the HTTP status code should be 200

  When checking the title of the page
  Then the title should match the expected value

  When checking the URL of the app
  Then the URL should be correct with no unexpected redirects



    
                         
