from flask import Flask, render_template

def create_app(test_config=None):
    app = Flask('bluemoon', instance_relative_config=True) # Tên package

    # Cấu hình app ở đây
    if test_config is not None:
        app.config.from_mapping(test_config)

    # Đăng ký route index TẠM THỜI vào app:
    @app.route('/')
    def index():
        return render_template('index.html')

    return app