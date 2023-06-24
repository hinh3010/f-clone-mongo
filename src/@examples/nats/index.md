`nats` là một thư viện Node.js cho phép kết nối và tương tác với NATS, một nền tảng messaging có hiệu suất cao. `nats` hỗ trợ đầy đủ tính năng của NATS, bao gồm cả JetStream - một giải pháp messaging được thiết kế cho các ứng dụng có tính khả dụng cao và đòi hỏi tính toàn vẹn dữ liệu.

Để sử dụng `nats` với JetStream trong Node.js, bạn cần cài đặt thư viện `nats` và phiên bản NATS server hỗ trợ JetStream. Sau đó, bạn có thể sử dụng các tính năng của JetStream như tạo stream, tạo consumer group, gửi và nhận messages, và nhiều hơn nữa.

Các bước cơ bản để sử dụng `nats` với JetStream như sau:

1. Cài đặt `nats`: Bạn có thể cài đặt `nats` bằng lệnh `npm install nats` hoặc `yarn add nats`.

2. Tạo kết nối tới NATS server: Bạn có thể sử dụng hàm `connect()` của `nats` để tạo kết nối tới NATS server. Ví dụ:

```
const nats = require('nats');

const nc = nats.connect({
  servers: ['nats://localhost:4222'],
  // enable JetStream
  jetstream: true,
});

nc.on('connect', () => {
  console.log('Connected to NATS server');
});

nc.on('error', (err) => {
  console.log('Error:', err);
});
```

3. Tạo stream: Bạn có thể sử dụng phương thức `jetstream()` để tạo một stream. Ví dụ:

```
nc.jetstream().addStream('my-stream', {
  subjects: ['my-subject'],
  storage: nats.STREAM_STORAGE_MEMORY,
}, (err) => {
  if (err) {
    console.log('Error:', err);
  } else {
    console.log('Stream created successfully');
  }
});
```

4. Tạo consumer group: Bạn có thể sử dụng phương thức `jetstream()` để tạo một consumer group cho stream. Ví dụ:

```
nc.jetstream().addConsumer('my-stream', {
  durable_name: 'my-consumer-group',
}, (err) => {
  if (err) {
    console.log('Error:', err);
  } else {
    console.log('Consumer group created successfully');
  }
});
```

5. Gửi tin nhắn tới stream: Bạn có thể sử dụng phương thức `publish()` để gửi tin nhắn tới stream. Ví dụ:

```
nc.publish('my-subject', 'Hello, JetStream!');
```

6. Nhận tin nhắn từ consumer group: Bạn có thể sử dụng phương thức `jetstream()` và `pull()` để nhận tin nhắn từ consumer group. Ví dụ:

```
nc.jetstream().pull('my-stream', 'my-consumer-group', { max_waiting: 1000 }, (err, batch) => {
  if (err) {
    console.log('Error:', err);
  } else {
    batch.forEach((msg) => {
      console.log(`Received message: ${msg.data}`);
      msg.ack();
    });
  }
});
```

Lưu ý rằng JetStream cung cấp nhiều tính năng khác nhau, và các phương thức và tham số có thể khác nhau tùy thuộc vào từng tính năng. Bạn có thể tham khảo tài liệu của NATS và `nats` để biết thêm chi tiết.