import React from "react";
import "NotFoundPage.css"; // Import your CSS file here


const NotFoundPage: React.FC = () => {
    // css
    return (
        <div className="container">
            <h1 className="heading">404 - Not Found</h1>
            <p className="paragraph">
                The page you are looking for does not exist. Please check the URL
                or return to thehome page.
            </p>
            <p className="paragraph">
                If you think this is a mistake, please contact support.
            </p>
            <p className="paragraph">
                You can also try searching for the content you are looking for
                using the search bar above.
            </p>
     
        </div>
    );
}
export default NotFoundPage;