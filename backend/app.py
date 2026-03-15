from flask import Flask
from flask_cors import CORS
from routes.stock import stock_bp
from routes.history import history_bp
from routes.indicators import indicators_bp
from routes.fundamentals import fundamentals_bp
from routes.news import news_bp
from routes.market import market_bp
from config import Config

app = Flask(__name__, static_folder="../frontend", static_url_path="")
CORS(app)

app.register_blueprint(stock_bp)
app.register_blueprint(history_bp)
app.register_blueprint(indicators_bp)
app.register_blueprint(fundamentals_bp)
app.register_blueprint(news_bp)
app.register_blueprint(market_bp)

@app.route("/")
def index():
    return app.send_static_file("index.html")

if __name__ == "__main__":
    app.run(debug=Config.DEBUG, port=Config.PORT)
