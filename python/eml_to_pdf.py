import os
import email

def convert_eml_to_txt(eml_file_paths, output_file):
    combined_text = ''
    for eml_file_path in eml_file_paths:
        with open(eml_file_path, 'r', encoding='latin1') as eml_file:
            msg = email.message_from_file(eml_file)
            plain_text = get_email_text(msg)
            combined_text += plain_text + '\n\n'

    with open(output_file, 'w', encoding='utf-8') as txt_file:
        txt_file.write(combined_text)

    print(f"Successfully converted EML files to {output_file}")

def get_email_text(msg):
    text = ''
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            if content_type == 'text/plain':
                text += part.get_payload(decode=True).decode(errors='ignore')
    else:
        text = msg.get_payload(decode=True).decode(errors='ignore')

    return text

# Specify the directory containing the EML files
eml_folder = 'eml_files'

# Get the list of EML file paths in the directory
eml_file_paths = [os.path.join(eml_folder, file) for file in os.listdir(eml_folder) if file.endswith('.eml')]

# Specify the output TXT file
output_file = 'combined_text.txt'

# Call the function with the updated parameters
convert_eml_to_txt(eml_file_paths, output_file)