use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    sysvar::Sysvar,
};

use borsh::{BorshDeserialize, BorshSerialize};


fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8], 
) -> ProgramResult {

    if instruction_data.len() == 0 {
        return Err(ProgramError::InvalidInstructionData);
    }

    if instruction_data[0] == 0 {
        return create_wallet(
            program_id,
            accounts,
            &instruction_data[1..instruction_data.len()],
        );
    } else if instruction_data[0] == 1 {
        return send_lamports(
            program_id,
            accounts,
            &instruction_data[1..instruction_data.len()],
        );
    } else if instruction_data[0] == 2 {
        return change_wardens(
            program_id,
            accounts,
            &instruction_data[1..instruction_data.len()],
        );
    } else if instruction_data[0] == 3 {
        return change_owner(
            program_id,
            accounts,
            &instruction_data[1..instruction_data.len()],
        );
    }



    msg!("Didn't find the entrypoint required");
    Err(ProgramError::InvalidInstructionData)
}

entrypoint!(process_instruction);

fn create_wallet(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let writing_account = next_account_info(accounts_iter)?;

    let creator_account = next_account_info(accounts_iter)?;

    if !creator_account.is_signer {
        msg!("creator_account should be signer");
        return Err(ProgramError::IncorrectProgramId);
    }
    if writing_account.owner != program_id {
        msg!("writing_account isn't owned by program");
        return Err(ProgramError::IncorrectProgramId);
    }


    let mut input_data = AbstractWallet::try_from_slice(&instruction_data)
        .expect("Instruction data serialization didn't worked");

    if input_data.admin != *creator_account.key {
        msg!("Invaild instruction data");
        return Err(ProgramError::InvalidInstructionData);
    }

    let rent_exemption = Rent::get()?.minimum_balance(writing_account.data_len());

    if **writing_account.lamports.borrow() < rent_exemption {
        msg!("The balance of writing_account should be more then rent_exemption");
        return Err(ProgramError::InsufficientFunds);
    }

    input_data.balance= (**writing_account.lamports.borrow() - rent_exemption);

    input_data.serialize(&mut &mut writing_account.data.borrow_mut()[..])?;

    Ok(())
}

fn send_lamports(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    Ok(())
}

fn change_wardens(
    program_id: &Pubkey, 
    accounts: &[AccountInfo], 
    _instruction_data: &[u8]
) -> ProgramResult {
    Ok(())
}

fn change_owner(
    program_id: &Pubkey, 
    accounts: &[AccountInfo], 
    _instruction_data: &[u8]
) -> ProgramResult {
    Ok(())
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
struct AbstractWallet {
    pub admin: Pubkey,
    pub description: String,
    pub warden1: Pubkey,
    pub warden2: Pubkey,
    pub warden3: Pubkey,
    pub balance: u64,
}

