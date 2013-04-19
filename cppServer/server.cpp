#include <iostream>
#include <string>
#include <fstream>
#include <streambuf>
#include </Users/sboddeus/SourceCode/node.native/native/native.h>
using namespace native::http;
    
int main() {
    http server;
    if(!server.listen("0.0.0.0", 8080, [](request& req, response& res) {
        if (req.url().path() == "/css/style.css")
        {            
            res.set_status(200);
            res.set_header("Content-Type", "stylesheet");
            //open file
            std::ifstream fin("static/css/styles.css");
            std::string str((std::istreambuf_iterator<char>(fin)),
                        std::istreambuf_iterator<char>());
            res.end(str);
        }
        else if (req.url().path() == "/js/three.min.js")
        {
            res.set_status(200);
            res.set_header("Content-Type", "text/javascript");
            //open file
            std::ifstream fin("static/js/three.min.js");
            std::string str((std::istreambuf_iterator<char>(fin)),
                        std::istreambuf_iterator<char>());
            res.end(str);
        
        }
        else if (req.url().path() == "/js/TrackballControls.js")
        {
            res.set_status(200);
            res.set_header("Content-Type", "text/javascript");
            //open file
            std::ifstream fin("static/js/TrackballControls.js");
            std::string str((std::istreambuf_iterator<char>(fin)),
                        std::istreambuf_iterator<char>());
            res.end(str);
        
        }
        else if (req.url().path() == "/js/jquery-1.9.1.min.js")
        {
            res.set_status(200);
            res.set_header("Content-Type", "text/javascript");
            //open file
            std::ifstream fin("static/js/jquery-1.9.1.min.js");
            std::string str((std::istreambuf_iterator<char>(fin)),
                        std::istreambuf_iterator<char>());
            res.end(str);
        
        }
        else if (req.url().path() == "/js/blockbuilder.js")
        {
            res.set_status(200);
            res.set_header("Content-Type", "text/javascript");
            //open file
            std::ifstream fin("static/js/blockbuilder.js");
            if(!fin.good())
                std::cerr << "Could not open file" << std::endl;
            std::string str((std::istreambuf_iterator<char>(fin)),
                        std::istreambuf_iterator<char>());
            std::cout << "Serving Up: \n\n" << str << std::endl;
            res.end(str);
        
        }
        else
        {
            //else pass index.html
            res.set_status(200);
            res.set_header("Content-Type", "text/html");
            //open file
            std::ifstream fin("index.html");
            std::string str((std::istreambuf_iterator<char>(fin)),
                        std::istreambuf_iterator<char>());
            res.end(str);
        }
    })) return 1; // Failed to run server.

    std::cout << "Server running at http://0.0.0.0:8080/" << std::endl;
    return native::run();
}

