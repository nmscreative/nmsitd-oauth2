export default class OAuthUser 
{
  userAccountId;
  birthdate;
  companyEmail;
  firstName;
  lastName;
  middleName;
  suffix;
  md5CompanyEmail;
  md5PersonalEmail;
  personalEmail;
  companyEmail;
  fullname;

  oauthUserData(oauthUser = null)
  {
    this.userAccountId = oauthUser?.user_account_id;
    this.birthdate = oauthUser?.birthdate;
    this.companyEmail = oauthUser?.company_email;
    this.firstName = oauthUser?.first_name;
    this.lastName = oauthUser?.last_name;
    this.middleName = oauthUser?.middle_name;
    this.suffix = oauthUser?.suffix;
    this.md5CompanyEmail = oauthUser?.md5_company_email;
    this.md5PersonalEmail = oauthUser?.md5_personal_email;
    this.personalEmail = oauthUser?.personal_email;
    this.companyEmail = oauthUser?.company_email;
    this.fullname = this.getFullname(oauthUser);
  }

  getFullname(oauthUser = {}, format = 'F L')
  {
    const { last_name = '', middle_name = '', first_name = '' } = oauthUser;
    switch(format.toUpperCase()) {
      case 'L F': return `${last_name} ${first_name}`;
      case 'L, F': return `${last_name}, ${first_name}`;
      case 'L, F M': return `${last_name}, ${first_name} ${middle_name}`;
      case 'F M L': return `${first_name} ${middle_name} ${last_name}`;
      default: return `${first_name} ${last_name}`;
    }
  }

  
}