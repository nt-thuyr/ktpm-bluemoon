import sys

sys.path.insert(0, 'src')

from bluemoon import create_app

# Gọi Factory Function
app = create_app()

if __name__ == '__main__':
    # Chạy máy chủ phát triển
    app.run(debug=True)