import requests
import json

def create_crm_lead(crm_url, api_token, lead_data):
    """
    Generic example to create a lead in a CRM via REST API.
    """
    headers = {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(
            f"{crm_url}/api/v1/leads",
            data=json.dumps(lead_data),
            headers=headers
        )
        response.raise_for_status()
        print("Lead created successfully!")
        return response.json()
    except Exception as e:
        print(f"Error creating lead: {e}")
        return None

# Placeholder data
if __name__ == "__main__":
    DATA = {
        "title": "New Business Opportunity",
        "contact_name": "John Doe",
        "email": "john@example.com"
    }
    # create_crm_lead("https://your-crm.com", "YOUR_TOKEN", DATA)
