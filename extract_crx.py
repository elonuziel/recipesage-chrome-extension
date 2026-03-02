import zipfile
import os

crx_file = r'c:\Users\Uziel\Documents\GitHub\helping mom\OEPPLNNFCEIDFAAACJPDPOBNJKCPGCPO_2_1_2_0.crx'
extract_dir = r'c:\Users\Uziel\Documents\GitHub\helping mom\extension_src'

if not os.path.exists(extract_dir):
    os.makedirs(extract_dir)

with open(crx_file, 'rb') as f:
    data = f.read()
    # Find the ZIP signature PK\x03\x04
    zip_start = data.find(b'PK\x03\x04')
    if zip_start != -1:
        zip_data = data[zip_start:]
        temp_zip = r'c:\Users\Uziel\Documents\GitHub\helping mom\temp_ext.zip'
        with open(temp_zip, 'wb') as zf:
            zf.write(zip_data)
        
        with zipfile.ZipFile(temp_zip, 'r') as zf:
            zf.extractall(extract_dir)
        
        os.remove(temp_zip)
        print(f"Extracted to {extract_dir}")
    else:
        print("Could not find ZIP signature in CRX file.")
