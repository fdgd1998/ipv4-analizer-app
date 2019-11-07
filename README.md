# IPv4 Analizer App
This simple app written using HTML, CSS and JS analizes an IPv4 network address.
It admits data input in the following format: xxx.xxx.xxx.xxx/xx, and it returns the following analysis:

- IP Class. : A, B, C, D or E.
- IP segmentation.
- Address type: private or public.
- Subnet mask: for each subnetwork if segmentation exists. If not, it's the mask address.
- Network address: for each subnetwork if segmentation exists. If not, it's the network address.
- Broadcast address: for each subnetwork if segmentation exists. If not, it's the broadcast address.
- Maximum number of posible networks: will be '1' if segmentation is not possible.
- Maximun number of hosts per subnetwork.
- Length of bits for networks, subnetwork and hosts addresses.

This app will be written in Python, Java and PHP as future projects.
